const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const outDir = path.resolve(__dirname, "verification");
fs.mkdirSync(outDir, { recursive: true });

const executablePath = path.join(
  process.env.LOCALAPPDATA,
  "ms-playwright",
  "chromium-1228",
  "chrome-win64",
  "chrome.exe"
);

async function capture(viewport, name) {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport });
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += Math.max(300, Math.floor(viewport.height * 0.7))) {
    await page.mouse.wheel(0, y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });

  const checks = await page.evaluate(() => ({
    title: document.title,
    textIncludes: [
      "Premium wear for modern living",
      "Fresh fits in our latest drop",
      "Defining modern style",
      "The voice of quality",
      "WEARIX",
    ].map((text) => [text, document.body.innerText.includes(text)]),
    linkCount: document.querySelectorAll("a").length,
    images: document.images.length,
    height: document.body.scrollHeight,
  }));

  await page.locator(".product-card").first().hover();
  await page.screenshot({ path: path.join(outDir, `${name}-hover-product.png`), fullPage: false });
  await page.locator(".btn").filter({ visible: true }).first().hover();
  await page.screenshot({ path: path.join(outDir, `${name}-hover-button.png`), fullPage: false });
  await page.locator('a[href="#shop"]').first().click();
  await page.waitForTimeout(500);
  const afterClick = await page.evaluate(() => window.scrollY);

  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify({ ...checks, afterClick }, null, 2));
  await browser.close();
}

(async () => {
  await capture({ width: 1440, height: 1200 }, "desktop");
  await capture({ width: 390, height: 900 }, "mobile");
})();
