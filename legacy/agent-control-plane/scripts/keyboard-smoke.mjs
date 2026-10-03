import { chromium } from "playwright";
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
  const structure = await page.evaluate(() => {
    const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "";
    const controls = Array.from(document.querySelectorAll("button,select,textarea,input,a[href]"));
    const unnamed = controls.filter((element) => {
      if (element.disabled) return false;
      const label = element.getAttribute("aria-label")?.trim() || element.textContent?.trim();
      return !label;
    }).map((element) => element.outerHTML.slice(0, 240));
    const focusable = controls.filter((element) => {
      const disabled = element.disabled;
      return !disabled && element.getAttribute("tabindex") !== "-1";
    }).length;
    return { lang: document.documentElement.lang, viewport, controls: controls.length, focusable, unnamed };
  });
  const focused = [];
  for (let index = 0; index < structure.focusable; index += 1) {
    await page.keyboard.press("Tab");
    focused.push(await page.evaluate(() => ({ tag: document.activeElement?.tagName ?? null, label: document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim().slice(0, 120) ?? null })));
  }
  const report = { url, capturedAt: new Date().toISOString(), structure, focused };
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/keyboard-smoke.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...structure, focused }));
  if (structure.lang !== "es" || structure.viewport.includes("maximum-scale") || structure.unnamed.length > 0) process.exitCode = 1;
} finally {
  await browser.close();
}
