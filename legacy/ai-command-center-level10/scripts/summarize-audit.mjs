import { readFileSync } from "node:fs";

const inputPath = process.argv[2] || "/tmp/ai-command-center-pnpm-audit.json";
const report = JSON.parse(readFileSync(inputPath, "utf8"));
const advisories = Object.values(report.advisories ?? {});
const counts = { low: 0, moderate: 0, high: 0, critical: 0 };
for (const advisory of advisories) {
  const severity = advisory.severity || "unknown";
  if (severity in counts) counts[severity] += 1;
}
console.log(JSON.stringify({
  metadata: report.metadata?.vulnerabilities ?? null,
  advisoryCount: advisories.length,
  severityCounts: counts,
  advisories: advisories.map((advisory) => ({
    id: advisory.github_advisory_id || advisory.id,
    module: advisory.module_name,
    severity: advisory.severity,
    vulnerableVersions: advisory.vulnerable_versions,
    patchedVersions: advisory.patched_versions,
    findings: (advisory.findings ?? []).map((finding) => ({ version: finding.version, paths: finding.paths })),
    url: advisory.url,
  })),
}, null, 2));
