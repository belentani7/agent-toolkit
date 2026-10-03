import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

const url = process.env.A11Y_URL;
if (!url) throw new Error("A11Y_URL is required");

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  const results = await new AxeBuilder({ page }).exclude('[aria-hidden="true"]').analyze();
  const report = {
    url,
    capturedAt: new Date().toISOString(),
    violations: results.violations,
    incomplete: results.incomplete,
    passes: results.passes,
    totals: {
      violations: results.violations.length,
      incomplete: results.incomplete.length,
      passes: results.passes.length,
    },
  };
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/a11y-report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.totals));
  if (results.violations.length > 0) process.exitCode = 1;
} finally {
  await browser.close();
}
