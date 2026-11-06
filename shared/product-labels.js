// Products saved before the New/Best seller checkboxes only have a single `tag`.
export function productLabels(product = {}) {
  const tag = String(product.tag || "").trim().toLowerCase();
  return {
    isNew: typeof product.isNew === "boolean" ? product.isNew : tag === "new" || tag === "new in",
    bestSeller: typeof product.bestSeller === "boolean" ? product.bestSeller : tag === "best seller",
  };
}

export const productSubcategories = ["EW Prints", "Embroidered"];

export function productSubcategory(product = {}) {
  return productSubcategories.includes(product.subcategory) ? product.subcategory : "EW Prints";
}
