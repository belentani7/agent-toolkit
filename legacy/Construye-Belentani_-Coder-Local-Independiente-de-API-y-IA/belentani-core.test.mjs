import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { appendAuditLog, classifyCommand, executeCommand, inspectWorkspace, isPathInsideWorkspace, readWorkspaceText, searchWorkspaceText, writeWorkspaceText } from "../core/belentani-core.mjs";

test("classifyCommand assigns all safety levels deterministically", () => {
  assert.equal(classifyCommand("git status").level, "SAFE");
  assert.equal(classifyCommand("mkdir reports").level, "CAUTION");
  assert.equal(classifyCommand("git reset --hard").level, "DANGEROUS");
  assert.equal(classifyCommand("rm -rf .").level, "BLOCKED");
  assert.equal(classifyCommand("curl https://example.com").level, "BLOCKED");
  assert.equal(classifyCommand("git -C /etc status").level, "BLOCKED");
  assert.equal(classifyCommand("git status; whoami").level, "BLOCKED");
});

test("workspace inspection reads a real selected directory and excludes heavy directories", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ packageManager: "pnpm@10", scripts: { test: "node --test" } }));
  await writeFile(path.join(root, "main.ts"), "export const answer = 42;");
  const report = await inspectWorkspace(root);
  assert.equal(report.status, "VERIFIED");
  assert.equal(report.fileCount, 2);
  assert.equal(report.languages.TypeScript, 1);
  assert.equal(report.packageManager, "pnpm");
});

test("path guard refuses paths outside the selected workspace", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  assert.equal(isPathInsideWorkspace(root, path.join(root, "file.txt")), true);
  assert.equal(isPathInsideWorkspace(root, path.join(root, "..", "outside.txt")), false);
});

test("command execution requires approval, runs in workspace and records evidence", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  await assert.rejects(() => executeCommand({ workspaceRoot: root, command: "node -e \"console.log('ok')\"" }), /APPROVAL_REQUIRED/);
  const result = await executeCommand({ workspaceRoot: root, command: "node -e \"console.log('ok')\"", approved: true });
  assert.equal(result.status, "VERIFIED");
  assert.match(result.stdout, /ok/);
  const audit = await readFile(path.join(root, ".belentani", "audit.jsonl"), "utf8");
  assert.match(audit, /VERIFIED/);
});

test("process timeouts have a failed observable result", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  await writeFile(path.join(root, "sleep.mjs"), "setTimeout(() => {}, 200)");
  const result = await executeCommand({ workspaceRoot: root, command: "node sleep.mjs", approved: true, timeoutMs: 25 });
  assert.equal(result.status, "FAILED");
  assert.equal(result.timedOut, true);
});

test("failed process launch produces local audit evidence instead of an unhandled error", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  const result = await executeCommand({ workspaceRoot: root, command: "belentani-command-that-does-not-exist", approved: true });
  assert.equal(result.status, "FAILED");
  assert.match(result.stderr, /belentani-command-that-does-not-exist/);
  const audit = await readFile(path.join(root, ".belentani", "audit.jsonl"), "utf8");
  assert.match(audit, /\"status\":\"FAILED\"/);
});

test("audit events always persist below the selected workspace", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  const record = await appendAuditLog(root, { tool: "test", status: "VERIFIED" });
  assert.equal(record.tool, "test");
  const audit = await readFile(path.join(root, ".belentani", "audit.jsonl"), "utf8");
  assert.match(audit, /\"tool\":\"test\"/);
});

test("filesystem write, read and search stay inside the selected workspace", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  await assert.rejects(() => writeWorkspaceText({ workspaceRoot: root, relativePath: "notes.txt", content: "local core" }), /APPROVAL_REQUIRED/);
  const written = await writeWorkspaceText({ workspaceRoot: root, relativePath: "notes.txt", content: "local core", approved: true });
  assert.equal(written.status, "VERIFIED");
  assert.equal(await readWorkspaceText(root, "notes.txt"), "local core");
  assert.deepEqual((await searchWorkspaceText({ workspaceRoot: root, query: "core" })).matches, [{ path: "notes.txt", line: 1 }]);
  await assert.rejects(() => readWorkspaceText(root, "../outside.txt"), /BLOCKED/);
});

test("workspace inspection degrades safely when a nested directory cannot be read", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "belentani-test-"));
  await writeFile(path.join(root, "visible.txt"), "visible");
  const report = await inspectWorkspace(root);
  assert.equal(report.status, "VERIFIED");
  assert.deepEqual(report.files, ["visible.txt"]);
});
