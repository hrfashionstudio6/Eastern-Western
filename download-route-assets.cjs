const fs = require("fs");
const path = require("path");
const https = require("https");

const outDir = path.resolve(__dirname, "public/assets");
const manifestPath = path.join(outDir, "manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};

const urls = new Set();
for (const file of fs.readdirSync(path.resolve(__dirname, "reference-routes"))) {
  if (!file.endsWith(".json")) continue;
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "reference-routes", file), "utf8"));
  for (const image of data.images || []) {
    if (image.src?.startsWith("https://framerusercontent.com/images/")) urls.add(image.src);
  }
}

function extFromUrl(url) {
  const ext = path.extname(new URL(url).pathname);
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
      if (res.statusCode !== 200) return reject(new Error(`${res.statusCode} ${url}`));
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

(async () => {
  let next = Math.max(0, ...fs.readdirSync(outDir).map((name) => parseInt(name, 10)).filter(Boolean)) + 1;
  for (const url of urls) {
    if (manifest[url]) continue;
    const filename = `${String(next).padStart(2, "0")}${extFromUrl(url)}`;
    next += 1;
    await download(url, path.join(outDir, filename));
    manifest[url] = `/assets/${filename}`;
    console.log(filename, url);
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
})();
