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

const stitchedOfferArticles = new Set([
  "afreen", "gul angan", "falak noor", "mehraab", "izhar e muhabat",
  "gul zeenat", "dastaan", "angan", "gulnaar", "sunehri shaam",
  "andaaz", "muhabat", "neel gulzar",
]);

export function fixedListingPrices(product, stitching) {
  if (stitching !== "Stitch") return product.unstitchPricing ?? unstitchedOffer(product);
  if (product.stitchPricing) return product.stitchPricing;

  const name = String(product.name || "").trim().toLowerCase();
  const regularPrice = priceAmount(product.oldPrice || product.compareAtPrice);
  if (!regularPrice || !stitchedOfferArticles.has(name)) return null;
  return { price: Math.round(regularPrice * 75) / 100, regularPrice };
}

export function listingPrices(product, stitching) {
  return fixedListingPrices(product, stitching) ?? {
    price: product.price,
    regularPrice: product.oldPrice || product.compareAtPrice || "",
  };
}

export function discountPercent(price, regularPrice) {
  const regular = priceAmount(regularPrice);
  return regular > priceAmount(price) ? Math.round((1 - priceAmount(price) / regular) * 100) : 0;
}
