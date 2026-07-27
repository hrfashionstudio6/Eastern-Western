const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const outDir = path.resolve(__dirname, "reference");
fs.mkdirSync(outDir, { recursive: true });

async function capture(viewport, name) {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_PATH ||
      path.join(
        process.env.LOCALAPPDATA,
        "ms-playwright",
        "chromium-1228",
        "chrome-win64",
        "chrome.exe"
      ),
  });
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(60000);
  await page.goto("https://easternwestern.framer.ai/", {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += Math.max(300, Math.floor(viewport.height * 0.7))) {
    await page.mouse.wheel(0, y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: true,
  });
  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const links = [...document.querySelectorAll("a")].map((a) => ({
      text: a.innerText,
      href: a.href,
      rect: a.getBoundingClientRect().toJSON(),
    }));
    const images = [...document.images].map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      rect: img.getBoundingClientRect().toJSON(),
    }));
    const bgImages = [...document.querySelectorAll("*")]
      .map((el) => {
        const style = getComputedStyle(el);
        const bg = style.backgroundImage;
        if (!bg || bg === "none") return null;
        const rect = el.getBoundingClientRect();
        return {
          bg,
          rect: rect.toJSON(),
          text: el.innerText?.slice(0, 120) || "",
        };
      })
      .filter(Boolean);
    return {
      title: document.title,
      url: location.href,
      text,
      links,
      images,
      bgImages,
      htmlLength: document.documentElement.outerHTML.length,
    };
  });
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(data, null, 2));
  await browser.close();
}

(async () => {
  await capture({ width: 1440, height: 1200 }, "desktop");
  await capture({ width: 390, height: 900 }, "mobile");
})();
