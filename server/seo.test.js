import http from "node:http";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pageSeo, renderSeo, sitemapXml } from "../shared/seo.js";
const products = [{ slug: "afreen", name: "Afreen", status: "published", price: 6299, image: "/photo.jpg" }];
test("product SEO includes canonical price and safe structured data; query filters do not enter canonical", () => {
  const seo = pageSeo("/shop/afreen", products);
  assert.equal(seo.title, "Afreen | Eastern Western");
  assert.equal(seo.canonical, "https://easternwestern.net/shop/afreen");
  assert.equal(seo.schema.offers.price, 6299);
  const html = renderSeo('<head><title>Old</title><meta name="description" content="Old"></head>', pageSeo('/shop/afreen', [{ ...products[0], name: '</script><img src=x onerror=alert(1)>' }]));
  assert.ok(!html.includes('</script><img'));
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal(pageSeo('/missing').noindex, true);
  assert.equal(pageSeo('/checkout').noindex, true);
  assert.ok(sitemapXml(products).includes('/shop/afreen'));
  assert.ok(!sitemapXml(products).includes('/checkout'));
});
test("HTTP SEO routes return crawlable metadata, valid sitemap, missing-page 404s and alias redirects", async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'ew-seo-'));
  let server;
  try {
    await fs.cp(path.join(root, 'server'), path.join(temp, 'server'), { recursive: true });
    await fs.cp(path.join(root, 'shared'), path.join(temp, 'shared'), { recursive: true });
    await fs.symlink(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
    await fs.writeFile(path.join(temp, 'package.json'), '{"type":"module"}');
    await fs.mkdir(path.join(temp, 'dist'));
    await fs.writeFile(path.join(temp, 'dist/index.html'), '<html><head><title>Old</title><meta name="description" content="Old"></head><body><div id="root"></div></body></html>');
    await fs.mkdir(path.join(temp, 'data'));
    await fs.writeFile(path.join(temp, 'data/local-store.json'), JSON.stringify({ products, orders: [], blogs: [], customers: [] }));
    process.env.NODE_ENV = 'test';
    const { app } = await import(pathToFileURL(path.join(temp, 'server/server.js')));
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const robots = await fetch(base+'/robots.txt');
    assert.match(robots.headers.get('content-type'), /text\/plain/);
    assert.match(await robots.text(), /Sitemap: https:\/\/easternwestern.net\/sitemap.xml/);
    const sitemap = await fetch(base+'/sitemap.xml');
    assert.match(sitemap.headers.get('content-type'), /application\/xml/);
    assert.match(await sitemap.text(), /<loc>https:\/\/easternwestern.net\/shop\/afreen<\/loc>/);
    const article = await fetch(base+'/shop/afreen');
    assert.equal(article.status,200);
    assert.match(await article.text(), /<title>Afreen \| Eastern Western<\/title>/);
    for (const route of ['/missing','/shop/missing','/assets/missing.js']) assert.equal((await fetch(base+route)).status,404);
    for (const host of ['www.easternwestern.net','easternwestern.pk','www.easternwestern.pk']) {
      const response = await new Promise((resolve, reject) => {
        http.get(base+'/shop?category=ready-to-wear', { headers: { Host: host } }, res => { res.resume(); resolve(res); }).on('error', reject);
      });
      assert.equal(response.statusCode,301);
      assert.equal(response.headers.location,'https://easternwestern.net/shop?category=ready-to-wear');
    }
  } finally {
    if (server) await new Promise(resolve=>server.close(resolve));
    await fs.rm(temp,{recursive:true,force:true});
  }
});
