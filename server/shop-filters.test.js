import test from "node:test";
import assert from "node:assert/strict";
import { filterProducts, pieceCount, shopQuery, sortProducts } from "../shared/shop-filters.js";

const products = [
  { name: "Afreen", sku: "EWP-06/2 Piece", price: "PKR 6,499", subcategory: "EW Prints", bestSeller: false },
  { name: "Mehraab", sku: "EWP-12 / 3 Piece", price: "PKR 8,640", subcategory: "EW Prints", bestSeller: true },
  { name: "Plain kurta", sku: "K-1", price: "PKR 2,500", subcategory: "Embroidered", bestSeller: false },
];
const names = (list) => list.map((p) => p.name);

test("reads the piece count from the article code", () => {
  assert.deepEqual(products.map(pieceCount), ["2", "3", ""]);
});

test("filters by price range, pieces and type; empty filters keep everything", () => {
  assert.deepEqual(names(filterProducts(products, {})), ["Afreen", "Mehraab", "Plain kurta"]);
  assert.deepEqual(names(filterProducts(products, { prices: ["0-3000"] })), ["Plain kurta"]);
  assert.deepEqual(names(filterProducts(products, { prices: ["0-3000", "6000-15000"], pieces: ["3"] })), ["Mehraab"]);
  assert.deepEqual(names(filterProducts(products, { types: ["Embroidered"] })), ["Plain kurta"]);
});

test("sorts by price and best sellers without changing the input", () => {
  assert.deepEqual(names(sortProducts(products, "price-asc")), ["Plain kurta", "Afreen", "Mehraab"]);
  assert.deepEqual(names(sortProducts(products, "price-desc")), ["Mehraab", "Afreen", "Plain kurta"]);
  assert.equal(sortProducts(products, "best-selling")[0].name, "Mehraab");
  assert.equal(products[0].name, "Afreen");
});

test("menu links map to shop filters", () => {
  assert.deepEqual(shopQuery("?category=ready-to-wear&type=ew-prints"), { category: "READY TO WEAR", type: "EW Prints" });
  assert.deepEqual(shopQuery("?category=bogus"), { category: "", type: "" });
});
