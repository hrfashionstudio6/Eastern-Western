import test from "node:test";
import assert from "node:assert/strict";
import { createCustomerMailer, orderPlacedEmail, orderStatusEmail, welcomeEmail } from "./customer-email.js";

const order = { orderNo: "EW-1", subtotal: 13000, customer: { name: "Ayesha <b>", email: "ayesha@example.com", address: "Lahore" }, items: [{ name: "Afreen", qty: 2, price: "PKR 6,500", size: "M", color: "Warm Ivory" }] };

test("order emails go to the customer from the shop mailbox and escape customer text", () => {
  const mail = orderPlacedEmail(order, "help@easternwestern.net");
  assert.equal(mail.to, "ayesha@example.com");
  assert.equal(mail.from.address, "help@easternwestern.net");
  assert.match(mail.subject, /EW-1/);
  assert.match(mail.html, /Ayesha &lt;b&gt;/);
  assert.doesNotMatch(mail.html, /Ayesha <b>/);
  assert.match(mail.text, /PKR 13,000/);
});

test("only out-for-delivery and delivered statuses have emails", () => {
  assert.match(orderStatusEmail(order, "out for delivery", "x@y.z").subject, /on its way/);
  assert.match(orderStatusEmail(order, "delivered", "x@y.z").subject, /delivered/);
  assert.equal(orderStatusEmail(order, "shipped", "x@y.z"), null);
  assert.equal(welcomeEmail({ name: "Sara", email: "s@example.com" }, "x@y.z").to, "s@example.com");
});

test("delivery failures are reported but never thrown", async () => {
  const errors = [];
  const mailer = createCustomerMailer({ sendMail: async () => { throw Object.assign(new Error("down"), { code: "ECONNECTION" }); }, fromAddress: "x@y.z", onError: (error) => errors.push(error.code) });
  assert.equal(await mailer.orderPlaced(order), false);
  assert.deepEqual(errors, ["ECONNECTION"]);
  assert.equal(await createCustomerMailer({ sendMail: null, fromAddress: "x@y.z" }).welcome({ email: "a@b.c" }), false);
});
