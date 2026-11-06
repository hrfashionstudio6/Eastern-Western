import test from "node:test";
import assert from "node:assert/strict";
import { productLabels, productSubcategory } from "../shared/product-labels.js";

test("legacy single tags map to the New and Best seller labels", () => {
  assert.deepEqual(productLabels({ tag: "New" }), { isNew: true, bestSeller: false });
  assert.deepEqual(productLabels({ tag: "Best seller" }), { isNew: false, bestSeller: true });
  assert.deepEqual(productLabels({ tag: "Save 25%" }), { isNew: false, bestSeller: false });
});

test("saved checkboxes take precedence over the legacy tag", () => {
  assert.deepEqual(productLabels({ tag: "Best seller", isNew: true, bestSeller: true }), { isNew: true, bestSeller: true });
  assert.deepEqual(productLabels({ tag: "New", isNew: false, bestSeller: false }), { isNew: false, bestSeller: false });
});

test("products without a known sub-category are EW Prints", () => {
  assert.equal(productSubcategory({}), "EW Prints");
  assert.equal(productSubcategory({ subcategory: "Embroidered" }), "Embroidered");
  assert.equal(productSubcategory({ subcategory: "Other" }), "EW Prints");
});
