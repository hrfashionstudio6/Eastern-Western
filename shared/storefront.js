export const LAUNCH_OFFER_TEXT = "Grand Launch Offer — Flat 10% OFF";
export const removedStorePath = /^\/(?:about|blog|contact)(?:\/.*)?\/?$/;
export function whatsappLink(phone = "+923035721398") {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "92" + digits.slice(1);
  if (digits.length < 10 || digits.length > 15) digits = "923035721398";
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent("Assalam o Alaikum! I need help with an Eastern Western article.");
}
