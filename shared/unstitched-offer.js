import { pieceCount } from "./shop-filters.js";

const offerPrices = {
  "gul zeenat": 4899,
  dastaan: 4199,
  "izhar e muhabat": 4599,
  muhabat: 4599,
  "neel gulzar": 4599,
  mehraab: 4499,
};

export function unstitchedOffer(product) {
  const name = String(product.name || "").trim().toLowerCase();
  const price = Object.hasOwn(offerPrices, name) ? offerPrices[name] : pieceCount(product) === "2" ? 3599 : null;
  return price === null ? null : { price, regularPrice: Math.round(price / 0.9 * 100) / 100 };
}
