import test from "node:test";
import assert from "node:assert/strict";
import { createCustomerMailer, orderPlacedEmail, ownerOrderEmail, orderStatusEmail, welcomeEmail } from "./customer-email.js";

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
  assert.deepEqual(errors, ["ECONNECTION", "ECONNECTION"]);
  assert.equal(await createCustomerMailer({ sendMail: null, fromAddress: "x@y.z" }).welcome({ email: "a@b.c" }), false);
});


test("order placement sends separate customer and owner emails", async () => {
  const mails = [];
  const mailer = createCustomerMailer({ sendMail: async mail => mails.push(mail), fromAddress: "sender@example.com", ownerAddress: "help@easternwestern.net" });
  assert.equal(await mailer.orderPlaced(order), true);
  assert.equal(mails.length, 2);
  assert.deepEqual(mails.map(mail => mail.to).sort(), ["ayesha@example.com", "help@easternwestern.net"]);
  const owner = mails.find(mail => mail.to === "help@easternwestern.net");
  assert.match(owner.subject, /New order.*EW-1/);
  assert.match(owner.text, /PKR 13,000/);
  assert.match(owner.text, /Delivery address: Lahore/);
  assert.match(owner.html, /Ayesha &lt;b&gt;/);
  assert.equal(owner.bcc, undefined);
  assert.equal(owner.cc, undefined);
  assert.equal(mails.find(mail => mail.to === "ayesha@example.com").text.includes("help@easternwestern.net"), false);
});

test("guest order without email still notifies the owner", async () => {
  const mails = [];
  const mailer = createCustomerMailer({ sendMail: async mail => mails.push(mail), fromAddress: "sender@example.com", ownerAddress: "help@easternwestern.net" });
  assert.equal(await mailer.orderPlaced({ ...order, customer: { name: "Guest", phone: "03001234567", address: "Lahore", email: "" } }), true);
  assert.equal(mails.length, 1);
  assert.equal(mails[0].to, "help@easternwestern.net");
  assert.match(mails[0].text, /03001234567/);
});

test("a failed customer email does not prevent the owner notification", async () => {
  const sent = [];
  const mailer = createCustomerMailer({ sendMail: async mail => {
    if (mail.to === order.customer.email) throw new Error("customer delivery failed");
    sent.push(mail);
  }, fromAddress: "sender@example.com", ownerAddress: "help@easternwestern.net" });
  assert.equal(await mailer.orderPlaced(order), false);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "help@easternwestern.net");
});

test("owner notification uses the configured recipient, not visitor data", () => {
  const mail = ownerOrderEmail({ ...order, ownerAddress: "other@example.com", customer: { ...order.customer, ownerAddress: "other@example.com" } }, "sender@example.com", "help@easternwestern.net");
  assert.equal(mail.to, "help@easternwestern.net");
  assert.match(mail.html, /PKR 13,000/);
});
