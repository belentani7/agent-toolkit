import { globalEngine } from "./engine.js";

async function runTestMission() {
  console.log("==================================================");
  console.log("MANUS CORE ENGINE — REAL MISSION RUNNER TEST");
  console.log("==================================================");

  const mission = {
    id: `mission_${Date.now()}`,
    name: "Autonomous Tech & SEO Discovery Mission",
    urls: [
      "https://example.com",
      "https://httpbin.org/html",
      "https://github.com",
    ],
    objective: "Analyze target websites, extract title, detect tech stack, and return structured JSON.",
  };

  const result = await globalEngine.executeMission(mission);
  console.log("\n[Mission Completed Successfully]");
  console.log(JSON.stringify(result, null, 2));
  console.log("==================================================");
}

runTestMission().catch(console.error);
