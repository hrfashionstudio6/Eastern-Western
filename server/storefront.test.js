import test from "node:test";
import assert from "node:assert/strict";
import { whatsappLink, removedStorePath, LAUNCH_OFFER_TEXT } from "../shared/storefront.js";

test("WhatsApp uses the business number and prepares a draft without sending it", () => {
  for (const phone of ["+92 303 5721398", "00923035721398", "03035721398"]) {
    const link = new URL(whatsappLink(phone));
    assert.equal(link.host, "wa.me");
    assert.equal(link.pathname, "/923035721398");
    assert.match(link.searchParams.get("text"), /Eastern Western/);
  }
  assert.equal(new URL(whatsappLink("")).pathname, "/923035721398");
});
test("removed pages redirect without matching shop and admin routes", () => {
  for (const path of ["/about", "/about/", "/blog", "/blog/style-guide", "/contact"]) assert.equal(removedStorePath.test(path), true);
  for (const path of ["/", "/shop", "/shop/contact-print", "/admin", "/bags", "/fragrance"]) assert.equal(removedStorePath.test(path), false);
  assert.equal(LAUNCH_OFFER_TEXT, "Grand Launch Offer — Flat 10% OFF");
});
