#!/usr/bin/env node
import { globalEngine } from "./engine.js";
import { readMissionFile } from "./mission-file.js";
import { inspectWorkspaceStack } from "./stack.js";

const rawArgs = process.argv.slice(2);
const args = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;
const command = args[0];

async function main() {
  if (!command || command === "help") {
    console.log("==================================================");
    console.log("MANUS CORE ENGINE — CLI UTILITY");
    console.log("==================================================");
    console.log("Usage:");
    console.log("  pnpm manus -- mission run <url1> [url2] ...");
    console.log("  pnpm manus -- mission run-file <mission.yaml>");
    console.log("  pnpm manus -- mission status <id>");
    console.log("  pnpm manus -- mission results <id> [json|csv]");
    console.log("  pnpm manus -- stack inspect");
    console.log("==================================================");
    return;
  }

  if (command === "mission") {
    const subAction = args[1];
    if (subAction === "run") {
      const urls = args.slice(2);
      if (urls.length === 0) {
        console.error("Error: Please provide at least one target URL.");
        process.exit(1);
      }

      console.log(`[CLI] Launching autonomous mission on ${urls.length} target(s)...`);
      const result = await globalEngine.executeMission({
        name: "CLI Autonomous Extraction Mission",
        urls,
        objective: "Extract real content, titles and detect tech stack.",
      });

      console.log(JSON.stringify(result, null, 2));
    } else if (subAction === "run-file") {
      const filePath = args[2];
      if (!filePath) {
        console.error("Error: Please provide a YAML or JSON mission file.");
        process.exit(1);
      }
      const mission = await readMissionFile(filePath);
      console.log(JSON.stringify(await globalEngine.executeMission(mission), null, 2));
    } else if (subAction === "status") {
      const id = args[2];
      if (!id) {
        console.error("Error: Please provide a mission ID.");
        process.exit(1);
      }
      const res = await globalEngine.getMissionResult(id);
      if (!res) {
        console.error(`Error: Mission ${id} not found.`);
        process.exit(1);
      }
      console.log(JSON.stringify(res, null, 2));
    } else if (subAction === "results") {
      const id = args[2];
      const format = args[3] === "csv" ? "csv" : "json";
      if (!id) {
        console.error("Error: Please provide a mission ID.");
        process.exit(1);
      }
      console.log(await globalEngine.exportMission(id, format));
    } else {
      console.error(`Unknown mission sub-action: ${subAction}`);
    }
  } else if (command === "stack" && args[1] === "inspect") {
    console.log(JSON.stringify(await inspectWorkspaceStack(), null, 2));
  } else {
    console.error(`Unknown command: ${command}`);
  }
}

main().catch((err) => {
  console.error("[CLI Error]", err);
  process.exit(1);
});
