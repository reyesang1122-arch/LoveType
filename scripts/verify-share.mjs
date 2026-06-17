import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const URL = "http://localhost:3000/result?s=20-10-5-8-12-6-9-14";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, // iPhone 12-ish
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: "networkidle" });

// confirm the result rendered (spirit name visible)
await page.waitForSelector("text=守护狐", { timeout: 15000 });
console.log("✓ result page rendered (守护狐)");

// click the generate button
const btn = page.getByRole("button", { name: /生成/ });
await btn.click();
console.log("✓ clicked 生成 button");

// wait for the preview image (data URL) to appear
const img = page.locator('img[alt*="分享卡"]');
await img.waitFor({ state: "visible", timeout: 30000 });
const src = await img.getAttribute("src");

if (!src || !src.startsWith("data:image/png")) {
  console.error("✗ preview src is not a PNG data URL:", String(src).slice(0, 40));
  process.exit(1);
}
const b64 = src.split(",")[1];
const bytes = Buffer.from(b64, "base64");
writeFileSync("scripts/share-output.png", bytes);
console.log(`✓ share card PNG generated: ${(bytes.length / 1024).toFixed(0)} KB -> scripts/share-output.png`);

// check the share button label + Web Share API plumbing
const shareBtnText = await page.locator('button:has-text("保存"), button:has-text("分享")').first().innerText();
console.log("✓ share button label:", shareBtnText.trim());

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
console.log("DONE");
