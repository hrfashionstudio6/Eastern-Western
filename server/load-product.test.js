import test from "node:test";
import assert from "node:assert/strict";
import { loadProduct } from "../shared/load-product.js";

test("direct article requests encode the saved slug and recover from a temporary failure", async () => {
  let calls = 0;
  const product = { name: "Test article", slug: "Eos dolor et volupta" };
  const result = await loadProduct(product.slug, { fetcher: async (url, options) => {
    assert.equal(url, "/api/products/Eos%20dolor%20et%20volupta");
    assert.equal(options.cache, "no-store");
    if (++calls === 1) throw new TypeError("Failed to fetch");
    return Response.json({ product });
  } });
  assert.deepEqual(result, product);
  assert.equal(calls, 2);
});

test("only a confirmed 404 becomes not found; server failures remain errors", async () => {
  assert.equal(await loadProduct("missing", { fetcher: async () => new Response("", { status: 404 }) }), null);
  let calls = 0;
  await assert.rejects(loadProduct("exists", { fetcher: async () => { calls++; return new Response("", { status: 503 }); } }), /could not be loaded/);
  assert.equal(calls, 3);
});

