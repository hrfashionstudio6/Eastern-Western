import { priceAmount } from "./money.js";
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

export function listingPrices(product, stitching) {
  if (stitching === "Stitch") {
    return product.stitchPricing ?? {
      price: product.price,
      regularPrice: product.oldPrice || product.compareAtPrice || "",
    };
  }
  return product.unstitchPricing ?? unstitchedOffer(product) ?? {
    price: product.price,
    regularPrice: product.oldPrice || product.compareAtPrice || "",
  };
}

export function discountPercent(price, regularPrice) {
  const regular = priceAmount(regularPrice);
  return regular > priceAmount(price) ? Math.round((1 - priceAmount(price) / regular) * 100) : 0;
}
