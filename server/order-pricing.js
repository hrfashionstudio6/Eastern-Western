// Prices, names and photos come from the saved article, never from the browser.
export function priceOrderItems(items, findProduct) {
  return items.map((item) => {
    const product = findProduct(String(item.slug || ""));
    if (!product) {
      const error = new Error("An article in your cart is no longer available. Please remove it and try again.");
      error.status = 400;
      throw error;
    }
    const sku = String(item.sku || "");
    const color = String(item.color || "");
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const variant = variants.find((entry) => sku && entry.sku === sku) || variants.find((entry) => color && entry.color === color);
    return {
      slug: product.slug,
      size: String(item.size || ""),
      color,
      sku: sku || String(variant?.sku || product.sku || ""),
      name: product.name,
      image: variant?.image || product.image || "",
      price: variant?.price || product.price,
      qty: Math.min(50, Math.max(1, Math.floor(Number(item.qty)) || 1)),
    };
  });
}
