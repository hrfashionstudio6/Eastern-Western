import { priceAmount } from "./money.js";

export const priceRanges = [
  { id: "0-3000", label: "PKR 0 to PKR 3,000", min: 0, max: 3000 },
  { id: "3000-6000", label: "PKR 3,000 to PKR 6,000", min: 3000, max: 6000 },
  { id: "6000-15000", label: "PKR 6,000 to PKR 15,000", min: 6000, max: 15000 },
  { id: "15000+", label: "PKR 15,000 and above", min: 15000, max: Infinity },
];
export const pieceOptions = ["1", "2", "3"];
export const sortOptions = [["featured", "Featured"], ["best-selling", "Best selling"], ["price-asc", "Price, low to high"], ["price-desc", "Price, high to low"]];

// Article codes and names carry the piece count, e.g. "EWP-03 / 3 Piece".
export function pieceCount(product) {
  const match = [product.sku, product.name].join(" ").match(/(\d)\s*-?\s*pie?ce/i);
  return match ? match[1] : "";
}

// `filters` holds sets of selected ids; an empty set means "any".
export function filterProducts(products, { prices = [], pieces = [], types = [] } = {}) {
  const ranges = priceRanges.filter((range) => prices.includes(range.id));
  return products.filter((product) => {
    const price = priceAmount(product.price);
    if (ranges.length && !ranges.some((range) => price >= range.min && price < range.max)) return false;
    if (pieces.length && !pieces.includes(pieceCount(product))) return false;
    if (types.length && !types.includes(product.subcategory)) return false;
    return true;
  });
}

export function sortProducts(products, sort = "featured") {
  const list = [...products];
  if (sort === "price-asc") list.sort((a, b) => priceAmount(a.price) - priceAmount(b.price));
  if (sort === "price-desc") list.sort((a, b) => priceAmount(b.price) - priceAmount(a.price));
  if (sort === "best-selling") list.sort((a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)));
  return list;
}

const categorySlugs = { "ready-to-wear": "READY TO WEAR", unstitched: "UNSTITCHED" };
const typeSlugs = { "ew-prints": "EW Prints", embroidered: "Embroidered" };

export function shopQuery(search = "") {
  const params = new URLSearchParams(search);
  return { category: categorySlugs[params.get("category")] || "", type: typeSlugs[params.get("type")] || "" };
}
