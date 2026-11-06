import test from "node:test";
import assert from "node:assert/strict";
import { priceOrderItems } from "./order-pricing.js";

const products = [
  { slug: "afreen", name: "Afreen", price: "PKR 6,499", image: "a.webp", sku: "EWP-06", variants: [{ color: "Warm Ivory", sku: "EWP-06-IV", price: "PKR 6,999", image: "iv.webp" }] },
  { slug: "angan", name: "Angan", price: "PKR 7,000", image: "b.webp", variants: [] },
];
const find = (slug) => products.find((product) => product.slug === slug);

test("uses saved prices and names instead of browser-supplied values", () => {
  const [item] = priceOrderItems([{ slug: "angan", name: "Free suit", price: "PKR 1", qty: 2 }], find);
  assert.deepEqual(item, { slug: "angan", size: "", color: "", sku: "", name: "Angan", image: "b.webp", price: "PKR 7,000", qty: 2 });
});

test("uses the matching variant price and photo", () => {
  const [item] = priceOrderItems([{ slug: "afreen", color: "Warm Ivory", size: "M", price: "PKR 1" }], find);
  assert.equal(item.price, "PKR 6,999");
  assert.equal(item.image, "iv.webp");
  assert.equal(item.sku, "EWP-06-IV");
});

test("rejects unknown articles and clamps quantities", () => {
  assert.throws(() => priceOrderItems([{ slug: "missing" }], find), { status: 400 });
  assert.equal(priceOrderItems([{ slug: "angan", qty: -4 }], find)[0].qty, 1);
  assert.equal(priceOrderItems([{ slug: "angan", qty: 900 }], find)[0].qty, 50);
});
