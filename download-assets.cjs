const fs = require("fs");
const path = require("path");
const https = require("https");

const app = fs.readFileSync(path.resolve(__dirname, "src/App.jsx"), "utf8");
const urls = [...new Set(app.match(/https:\/\/framerusercontent\.com\/images\/[^"')]+/g) || [])];
const outDir = path.resolve(__dirname, "public/assets");
fs.mkdirSync(outDir, { recursive: true });

function extFromUrl(url) {
  const clean = new URL(url).pathname;
  const ext = path.extname(clean);
  return ext || ".jpg";
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`${res.statusCode} ${url}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

(async () => {
  const manifest = {};
  for (const [index, url] of urls.entries()) {
    const filename = `${String(index + 1).padStart(2, "0")}${extFromUrl(url)}`;
    const dest = path.join(outDir, filename);
    await download(url, dest);
    manifest[url] = `/assets/${filename}`;
    console.log(filename);
  }
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
})();
