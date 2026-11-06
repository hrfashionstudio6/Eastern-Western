const normalise = (value) => String(value || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

// Every word the shopper types must appear in the article's name, code,
// category, colours or search words.
export function searchProducts(products = [], query = "") {
  const words = normalise(query).split(" ").filter(Boolean);
  if (!words.length) return [];
  return products.filter((product) => {
    const haystack = normalise([
      product.name, product.sku, product.category, product.subcategory,
      ...(product.tags || []),
      ...(product.variants || []).map((variant) => variant.color),
    ].join(" "));
    return words.every((word) => haystack.includes(word));
  });
}
