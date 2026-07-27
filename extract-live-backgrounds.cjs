const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const executablePath = path.join(process.env.LOCALAPPDATA, "ms-playwright", "chromium-1228", "chrome-win64", "chrome.exe");
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto("https://easternwestern.framer.ai/", { waitUntil: "networkidle", timeout: 120000 });
  for (let y = 0; y < 5000; y += 500) {
    await page.mouse.wheel(0, y);
    await page.waitForTimeout(80);
  }
  const data = await page.evaluate(() =>
    [...document.querySelectorAll("*")]
      .map((el) => {
        const style = getComputedStyle(el);
        const bg = style.backgroundImage;
        if (!bg || bg === "none") return null;
        const r = el.getBoundingClientRect();
        return {
          bg,
          rect: { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height },
          text: (el.innerText || "").slice(0, 120),
        };
      })
      .filter(Boolean)
      .filter((x) => x.rect.y < 5000)
  );
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
