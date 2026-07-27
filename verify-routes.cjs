const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const routes = ["/", "/about", "/shop", "/shop/textured-knitted-shirt", "/blog", "/blog/how-to-master-the-art-of-minimal-street-style", "/contact"];
const outDir = path.resolve(__dirname, "verification-routes");
fs.mkdirSync(outDir, { recursive: true });

const executablePath = path.join(process.env.LOCALAPPDATA, "ms-playwright", "chromium-1228", "chrome-win64", "chrome.exe");

async function capture(route, viewport, suffix) {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: "networkidle" });
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += Math.floor(viewport.height * 0.75)) {
    await page.mouse.wheel(0, y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(250);
  const name = `${route === "/" ? "home" : route.slice(1).replaceAll("/", "--")}-${suffix}`;
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  const data = await page.evaluate(() => ({
    title: document.title,
    path: location.pathname,
    height: document.body.scrollHeight,
    text: document.body.innerText,
    links: document.querySelectorAll("a").length,
    images: document.images.length,
  }));
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify({ ...data, errors }, null, 2));
  await browser.close();
}

(async () => {
  for (const route of routes) {
    await capture(route, { width: 1440, height: 1200 }, "desktop");
    await capture(route, { width: 390, height: 900 }, "mobile");
  }
})();
