#!/usr/bin/env node
/** Belentani CLI · punto de entrada local y sin API. */
import process from "node:process";
import { classifyCommand, executeCommand, inspectWorkspace, readWorkspaceText, runDoctor, searchWorkspaceText, writeWorkspaceText } from "../core/belentani-core.mjs";

const args = process.argv.slice(2);
const action = args[0] ?? "help";
const rootIndex = args.indexOf("--workspace");
const workspace = rootIndex >= 0 ? args[rootIndex + 1] : process.cwd();
const plainArgs = rootIndex >= 0
  ? args.filter((_, index) => index !== rootIndex && index !== rootIndex + 1)
  : args;

function print(value) { console.log(typeof value === "string" ? value : JSON.stringify(value, null, 2)); }
function option(name) { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; }
function help() {
  print(`Belentani Local Core\n\nUso:\n  node bin/belentani.mjs doctor [--workspace RUTA]\n  node bin/belentani.mjs inspect [--workspace RUTA]\n  node bin/belentani.mjs read --file RUTA [--workspace RUTA]\n  node bin/belentani.mjs search --query TEXTO [--workspace RUTA]\n  node bin/belentani.mjs write --approve --file RUTA --content TEXTO [--workspace RUTA]\n  node bin/belentani.mjs policy <comando>\n  node bin/belentani.mjs run --approve [--network] -- <comando>\n\nEl núcleo no usa APIs, modelos ni acceso de red implícito.`);
}

try {
  if (action === "doctor") print(await runDoctor(workspace));
  else if (action === "inspect") print(await inspectWorkspace(workspace));
  else if (action === "read") print(await readWorkspaceText(workspace, option("--file") ?? ""));
  else if (action === "search") print(await searchWorkspaceText({ workspaceRoot: workspace, query: option("--query") ?? "" }));
  else if (action === "write") print(await writeWorkspaceText({ workspaceRoot: workspace, relativePath: option("--file") ?? "", content: option("--content") ?? "", approved: args.includes("--approve") }));
  else if (action === "policy") print(classifyCommand(plainArgs.slice(1).join(" ")));
  else if (action === "run") {
    const separator = args.indexOf("--");
    const command = separator >= 0 ? args.slice(separator + 1).join(" ") : "";
    print(await executeCommand({ workspaceRoot: workspace, command, approved: args.includes("--approve"), allowNetwork: args.includes("--network") }));
  } else help();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
