// Inventory stays in admin records; storefront products remain orderable at any stock level.
export function publicProduct(product) {
  const { stock, variants, ...visible } = product;
  if (Array.isArray(variants)) {
    visible.variants = variants.map(({ stock, ...variant }) => variant);
  }
  return visible;
}
