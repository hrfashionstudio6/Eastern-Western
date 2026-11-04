import test from "node:test";
import assert from "node:assert/strict";
import { publicProduct } from "../shared/public-product.js";

test("public products hide article and variant stock while preserving purchase details", () => {
  const record = {
    id: "article-1", slug: "sample", status: "published", stock: 10,
    price: "PKR 1000", media: ["photo.webp"],
    variants: [{ size: "S, M", color: "Navy", stock: 0, price: "PKR 1100", sku: "SAMPLE", image: "navy.webp" }],
  };
  const visible = publicProduct(record);
  assert.equal(Object.hasOwn(visible, "stock"), false);
  assert.equal(Object.hasOwn(visible.variants[0], "stock"), false);
  assert.deepEqual(visible.variants[0], { size: "S, M", color: "Navy", price: "PKR 1100", sku: "SAMPLE", image: "navy.webp" });
  assert.equal(visible.price, record.price);
  assert.deepEqual(visible.media, record.media);
  assert.equal(record.stock, 10);
  assert.equal(record.variants[0].stock, 0);
});

test("zero-stock and untracked articles remain present in public data", () => {
  assert.deepEqual(publicProduct({ slug: "zero", stock: 0, variants: [] }), { slug: "zero", variants: [] });
  assert.deepEqual(publicProduct({ slug: "untracked" }), { slug: "untracked" });
});
