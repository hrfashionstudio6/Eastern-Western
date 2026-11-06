import { formatPKR } from "../shared/money.js";

const siteUrl = "https://easternwestern.net";
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

// Order statuses that send the customer an email, with the flag recording it was sent.
export const statusEmails = {
  "out for delivery": { flag: "outForDeliveryEmailAt", subject: "is on its way", heading: "Your order is on its way", text: "Our rider is on the way with your order. Please keep your phone nearby and have the Cash on Delivery amount ready." },
  delivered: { flag: "deliveredEmailAt", subject: "has been delivered", heading: "Your order has been delivered", text: "Your order has been delivered. We hope you love your new articles. If anything isn't right, reply to this email or contact us on WhatsApp." },
};

function layout(heading, bodyHtml) {
  return `<!doctype html><html><body style="margin:0;background:#f4f3ef;font-family:Arial,Helvetica,sans-serif;color:#222">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3ef;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:6px">
<tr><td style="padding:26px 28px 6px;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:.04em">EASTERN WESTERN</td></tr>
<tr><td style="padding:12px 28px 4px;font-size:20px;font-weight:bold">${escapeHtml(heading)}</td></tr>
<tr><td style="padding:8px 28px 26px;font-size:14px;line-height:1.6;color:#444">${bodyHtml}</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #eee;font-size:12px;line-height:1.6;color:#888">Need help? Reply to this email or write to help@easternwestern.net.<br><a href="${siteUrl}" style="color:#888">easternwestern.net</a></td></tr>
</table></td></tr></table></body></html>`;
}

function itemsTable(order) {
  const rows = (order.items || []).map((item) => {
    const options = [item.size && "Size: " + item.size, item.color && "Colour: " + item.color].filter(Boolean).join(" · ");
    return `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${escapeHtml(item.name)} × ${Number(item.qty) || 1}${options ? `<br><span style="color:#888;font-size:12px">${escapeHtml(options)}</span>` : ""}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #f0f0f0;white-space:nowrap">${escapeHtml(formatPKR(item.price))}</td></tr>`;
  }).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0;font-size:13px">${rows}<tr><td style="padding:10px 0;font-weight:bold">Total (Cash on Delivery)</td><td align="right" style="padding:10px 0;font-weight:bold">${escapeHtml(formatPKR(order.subtotal))}</td></tr></table>`;
}

function itemsText(order) {
  return (order.items || []).map((item) => `- ${item.name} x ${Number(item.qty) || 1}${item.size ? ", size " + item.size : ""}${item.color ? ", " + item.color : ""}: ${formatPKR(item.price)}`).concat("Total (Cash on Delivery): " + formatPKR(order.subtotal)).join("\n");
}

function message(fromAddress, to, subject, heading, text, html) {
  return {
    from: { name: "Eastern Western", address: fromAddress },
    to, replyTo: fromAddress, subject, text, html: layout(heading, html),
    disableFileAccess: true, disableUrlAccess: true,
  };
}

export function welcomeEmail(customer, fromAddress) {
  const name = customer.name || "there";
  const text = `Assalam o Alaikum ${name},\n\nWelcome to Eastern Western. Your account is ready, so you can now place orders and track them from your account.\n\nShop the collection: ${siteUrl}/shop`;
  const html = `<p>Assalam o Alaikum ${escapeHtml(name)},</p><p>Welcome to Eastern Western. Your account is ready, so you can now place orders and track them from your account.</p><p><a href="${siteUrl}/shop" style="display:inline-block;padding:12px 20px;background:#222;color:#fff;text-decoration:none;border-radius:4px">Shop the collection</a></p>`;
  return message(fromAddress, customer.email, "Welcome to Eastern Western", "Welcome to Eastern Western", text, html);
}

export function orderPlacedEmail(order, fromAddress) {
  const name = order.customer?.name || "there";
  const text = `Assalam o Alaikum ${name},\n\nThank you for your order ${order.orderNo}. We have received it and will contact you to confirm delivery.\n\n${itemsText(order)}\n\nDelivery address: ${order.customer?.address || ""}`;
  const html = `<p>Assalam o Alaikum ${escapeHtml(name)},</p><p>Thank you for your order <b>${escapeHtml(order.orderNo)}</b>. We have received it and will contact you to confirm delivery.</p>${itemsTable(order)}<p style="color:#666;font-size:13px">Delivery address: ${escapeHtml(order.customer?.address)}</p>`;
  return message(fromAddress, order.customer?.email, `Order ${order.orderNo} received`, "Thank you for your order", text, html);
}

export function orderStatusEmail(order, status, fromAddress) {
  const copy = statusEmails[status];
  if (!copy) return null;
  const name = order.customer?.name || "there";
  const text = `Assalam o Alaikum ${name},\n\n${copy.text}\n\nOrder ${order.orderNo}\n${itemsText(order)}`;
  const html = `<p>Assalam o Alaikum ${escapeHtml(name)},</p><p>${escapeHtml(copy.text)}</p><p>Order <b>${escapeHtml(order.orderNo)}</b></p>${itemsTable(order)}`;
  return message(fromAddress, order.customer?.email, `Your order ${order.orderNo} ${copy.subject}`, copy.heading, text, html);
}

// Emails never block or fail the request that triggered them.
export function createCustomerMailer({ sendMail, fromAddress, onError = () => {} }) {
  const send = async (mail) => {
    if (!sendMail || !mail?.to) return false;
    try { await sendMail(mail); return true; }
    catch (error) { onError(error); return false; }
  };
  return {
    welcome: (customer) => send(welcomeEmail(customer, fromAddress)),
    orderPlaced: (order) => send(orderPlacedEmail(order, fromAddress)),
    orderStatus: (order, status) => send(orderStatusEmail(order, status, fromAddress)),
  };
}
