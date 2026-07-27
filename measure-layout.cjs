const { chromium } = require("playwright");
const path = require("path");

const executablePath = path.join(process.env.LOCALAPPDATA, "ms-playwright", "chromium-1228", "chrome-win64", "chrome.exe");
const markers = [
  "Premium wear",
  "Fresh fits",
  "Defining modern style",
  "Our signature",
  "Modern collections",
  "The voice of quality",
  "Where style meets ease",
  "Elevating your daily",
  "See our community",
  "Subscribe to",
];

async function measure(url) {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 700) {
    await page.mouse.wheel(0, y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(250);
  const data = {};
  for (const marker of markers) {
    const locator = page.getByText(marker).first();
    try {
      const box = await locator.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
      }, { timeout: 2000 });
      data[marker] = box;
    } catch {
      data[marker] = null;
    }
  }
  await browser.close();
  return { height, data };
}

(async () => {
  console.log("REF", JSON.stringify(await measure("https://easternwestern.framer.ai/"), null, 2));
  console.log("LOCAL", JSON.stringify(await measure("http://127.0.0.1:5173/"), null, 2));
})();
