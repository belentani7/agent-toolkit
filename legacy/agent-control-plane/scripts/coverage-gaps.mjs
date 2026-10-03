import fs from "node:fs";

const report = JSON.parse(fs.readFileSync("coverage/coverage-final.json", "utf8"));
for (const [file, entry] of Object.entries(report)) {
  const uncovered = [];
  for (const [id, count] of Object.entries(entry.b)) {
    if (count.some((value) => value === 0)) {
      const locations = entry.branchMap[id]?.locations ?? [];
      count.forEach((value, index) => {
        if (value === 0) uncovered.push({ type: entry.branchMap[id]?.type, line: locations[index]?.start?.line, column: locations[index]?.start?.column });
      });
    }
  }
  if (uncovered.length) console.log(JSON.stringify({ file, uncovered }, null, 2));
}
