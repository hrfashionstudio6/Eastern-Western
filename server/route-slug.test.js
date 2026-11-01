import test from "node:test";
import assert from "node:assert/strict";
import { routeSlug } from "../shared/route-slug.js";

test("listing slugs match encoded links and direct page URLs", () => {
  for (const slug of ["Eos dolor et volupta", "ivory-blue-suit", "لباس", "Suit & Dupatta"]) {
    assert.equal(routeSlug(`/shop/${encodeURIComponent(slug)}`), slug);
    assert.equal(routeSlug(`/shop/${encodeURIComponent(slug)}/`), slug);
  }
  assert.equal(routeSlug("/shop/bad%url"), "bad%url");
});

