const mailbox = "help@easternwestern.net";
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function singleLine(value, label, maxLength, required = false) {
  if (value == null) value = "";
  if (typeof value !== "string") throw new Error(label + " is invalid.");
  const text = value.trim();
  if ((required && !text) || text.length > maxLength || /[\r\n\0]/.test(text)) throw new Error("Please enter a valid " + label.toLowerCase() + ".");
  return text;
}

export function validateContact(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Please complete the contact form.");
  const firstName = singleLine(body.firstName, "First name", 80, true);
  const lastName = singleLine(body.lastName, "Last name", 80);
  const email = singleLine(body.email, "Email address", 254, true).toLowerCase();
  if (!emailPattern.test(email)) throw new Error("Please enter a valid email address.");
  const phone = singleLine(body.phone, "Mobile number", 32);
  const subject = singleLine(body.subject, "Subject", 160, true);
  if (typeof body.message !== "string") throw new Error("Please enter your message.");
  const message = body.message.replace(/\r\n?/g, "\n").trim();
  if (message.length < 10 || message.length > 5000 || message.includes("\0")) throw new Error("Your message must contain between 10 and 5,000 characters.");
  return { name: [firstName, lastName].filter(Boolean).join(" "), email, phone, subject, message };
}

export function contactSmtpSettings(env = {}) {
  const user = String(env.SMTP_USER || mailbox).trim().toLowerCase();
  const password = env.SMTP_PASSWORD || env.SMTP_PASS;
  const toAddress = String(env.CONTACT_TO_EMAIL || mailbox).trim().toLowerCase();
  const host = String(env.SMTP_HOST || "smtp.hostinger.com").trim();
  const port = Number(env.SMTP_PORT || 465);
  if (!password || !emailPattern.test(user) || !emailPattern.test(toAddress) || !/^[a-z0-9.-]+$/i.test(host) || ![465, 587].includes(port)) return null;
  return {
    host, port, secure: port === 465, requireTLS: port === 587,
    auth: { user, pass: String(password) },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
    fromAddress: user, toAddress,
  };
}

export function buildContactEmail(contact, fromAddress, toAddress) {
  return {
    from: { name: "Eastern Western website", address: fromAddress },
    to: toAddress,
    replyTo: { name: contact.name, address: contact.email },
    subject: "[Website enquiry] " + contact.subject,
    text: [
      "New enquiry from the Eastern Western contact form",
      "",
      "Name: " + contact.name,
      "Email: " + contact.email,
      "Mobile: " + (contact.phone || "Not provided"),
      "Subject: " + contact.subject,
      "",
      "Message:",
      contact.message,
    ].join("\n"),
    disableFileAccess: true, disableUrlAccess: true,
  };
}

export function createContactHandler({ sendMail, fromAddress = mailbox, toAddress = mailbox, now = Date.now, onError = () => {}, limit = 5, windowMs = 15 * 60 * 1000 }) {
  const attempts = new Map();
  return async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (typeof req.body?.website === "string" && req.body.website.trim()) return res.json({ message: "Thank you for your message." });
    let contact;
    try { contact = validateContact(req.body); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    if (!sendMail) return res.status(503).json({ error: "The contact form is temporarily unavailable. Please email " + toAddress + " directly." });
    const time = now();
    const key = String(req.ip || req.socket?.remoteAddress || "") + "|" + contact.email;
    if (attempts.size >= 1000) {
      for (const [id, record] of attempts) if (record.expires <= time) attempts.delete(id);
      if (attempts.size >= 1000) attempts.delete(attempts.keys().next().value);
    }
    const current = attempts.get(key);
    const record = current && current.expires > time ? current : { count: 0, expires: time + windowMs };
    if (record.count >= limit) {
      res.set("Retry-After", String(Math.ceil((record.expires - time) / 1000)));
      return res.status(429).json({ error: "Too many attempts. Please wait a few minutes before trying again." });
    }
    record.count += 1;
    attempts.set(key, record);
    try {
      const result = await sendMail(buildContactEmail(contact, fromAddress, toAddress));
      if (!Array.isArray(result?.accepted) || !result.accepted.some(address => String(address).toLowerCase() === toAddress.toLowerCase())) throw new Error("Recipient not accepted");
      return res.json({ message: "Your message has been sent. Our team will get back to you." });
    } catch (error) {
      onError(error);
      return res.status(502).json({ error: "Your message could not be delivered. Please try again or email " + toAddress + " directly." });
    }
  };
}
