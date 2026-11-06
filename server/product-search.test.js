import test from "node:test";
import assert from "node:assert/strict";
import { searchProducts } from "../shared/product-search.js";

const products = [
  { name: "Izhar E Muhabat", sku: "EWP-03 / 3 Piece", category: "READY TO WEAR", variants: [{ color: "Warm Ivory / Light Cream Beige" }] },
  { name: "Gul Zeenat", sku: "EWP-09/ 3 Piece", category: "READY TO WEAR", variants: [{ color: "Deep Emerald Green" }], tags: ["Premium"] },
];

test("matches names, codes and colours regardless of case and punctuation", () => {
  assert.deepEqual(searchProducts(products, "muhabat").map((p) => p.name), ["Izhar E Muhabat"]);
  assert.deepEqual(searchProducts(products, "ewp 09").map((p) => p.name), ["Gul Zeenat"]);
  assert.deepEqual(searchProducts(products, "EMERALD").map((p) => p.name), ["Gul Zeenat"]);
  assert.deepEqual(searchProducts(products, "ready wear").length, 2);
});

test("requires every word and ignores empty queries", () => {
  assert.deepEqual(searchProducts(products, "ivory emerald"), []);
  assert.deepEqual(searchProducts(products, "   "), []);
});
