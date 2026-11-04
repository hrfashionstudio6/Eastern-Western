import test from "node:test";
import assert from "node:assert/strict";
import { buildContactEmail, contactSmtpSettings, createContactHandler, validateContact } from "./contact.js";

const valid = { firstName: "Website", lastName: "Visitor", email: "visitor@example.com", phone: "03001234567", subject: "Article enquiry", message: "Please tell me more about this article." };
const request = body => ({ body, ip: "127.0.0.1" });
function response() {
  return { statusCode: 200, headers: {}, body: null,
    set(key, value) { this.headers[key] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}
test("validates contact data and rejects invalid or injected headers", () => {
  assert.equal(validateContact({ ...valid, email: "  Visitor@Example.com  " }).email, "visitor@example.com");
  assert.throws(() => validateContact({ ...valid, email: "not-an-email" }));
  assert.throws(() => validateContact({ ...valid, subject: "Enquiry\r\nBcc: other@example.com" }));
  assert.throws(() => validateContact({ ...valid, firstName: { name: "Invalid" } }));
  assert.throws(() => validateContact({ ...valid, message: "x".repeat(5001) }));
});
test("uses authenticated sender, fixed recipient and visitor reply-to", () => {
  const contact = validateContact({ ...valid, to: "other@example.com" });
  const mail = buildContactEmail(contact, "help@easternwestern.net", "help@easternwestern.net");
  assert.equal(mail.from.address, "help@easternwestern.net");
  assert.equal(mail.to, "help@easternwestern.net");
  assert.equal(mail.replyTo.address, "visitor@example.com");
  assert.ok(mail.text.includes(valid.message));
  assert.equal(mail.disableFileAccess, true);
  assert.equal(mail.disableUrlAccess, true);
});
test("requires SMTP credentials and selects encrypted transport", () => {
  assert.equal(contactSmtpSettings({}), null);
  const settings = contactSmtpSettings({ SMTP_PASSWORD: "test-password" });
  assert.equal(settings.host, "smtp.hostinger.com");
  assert.equal(settings.port, 465);
  assert.equal(settings.secure, true);
  assert.equal(settings.auth.user, "help@easternwestern.net");
  assert.equal(contactSmtpSettings({ SMTP_PASSWORD: "test-password", SMTP_PORT: "587" }).requireTLS, true);
});
test("does not report success before the SMTP recipient is accepted", async () => {
  let finish;
  let captured;
  const handler = createContactHandler({ sendMail: mail => { captured = mail; return new Promise(resolve => { finish = resolve; }); } });
  const res = response();
  const pending = handler(request(valid), res);
  assert.equal(res.body, null);
  assert.equal(captured.to, "help@easternwestern.net");
  finish({ accepted: ["help@easternwestern.net"] });
  await pending;
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.message.includes("sent"));
});
test("missing SMTP and failed delivery return truthful errors", async () => {
  const missing = response();
  await createContactHandler({})(request(valid), missing);
  assert.equal(missing.statusCode, 503);
  const failed = response();
  await createContactHandler({ sendMail: async () => { throw new Error("private credential detail"); } })(request(valid), failed);
  assert.equal(failed.statusCode, 502);
  assert.ok(!failed.body.error.includes("private credential"));
  const rejected = response();
  await createContactHandler({ sendMail: async () => ({ accepted: [] }) })(request(valid), rejected);
  assert.equal(rejected.statusCode, 502);
});
test("invalid input and the spam field never send mail", async () => {
  let count = 0;
  const handler = createContactHandler({ sendMail: async () => { count++; return { accepted: ["help@easternwestern.net"] }; } });
  const invalid = response();
  await handler(request({ ...valid, message: "short" }), invalid);
  assert.equal(invalid.statusCode, 400);
  await handler(request({ ...valid, website: "spam.example" }), response());
  assert.equal(count, 0);
});
test("limits repeated attempts and allows sending after the window", async () => {
  let clock = 1000;
  const handler = createContactHandler({ sendMail: async () => ({ accepted: ["help@easternwestern.net"] }), limit: 2, windowMs: 60000, now: () => clock });
  await handler(request(valid), response());
  await handler(request(valid), response());
  const limited = response();
  await handler(request(valid), limited);
  assert.equal(limited.statusCode, 429);
  assert.ok(Number(limited.headers["Retry-After"]) > 0);
  clock += 60001;
  const later = response();
  await handler(request(valid), later);
  assert.equal(later.statusCode, 200);
});
