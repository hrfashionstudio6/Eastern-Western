export const importHeaders = ["Product name / Naam", "Product code", "Category", "Price (PKR)", "Old price (PKR)", "Stock / Pieces", "Description / Tafseel", "Size", "Colour / Rang", "Fabric / Kapra", "Status", "Label", "Featured", "Tags"];
const categories = { unstitched: "UNSTITCHED NEW IN", "unstitched new in": "UNSTITCHED NEW IN", "ready to wear": "READY TO WEAR", fabric: "FABRIC NEW IN", "fabric new in": "FABRIC NEW IN", "men's wear": "Men's Wear", "women's wear": "Women's Wear", "children's wear": "Children's Wear" };
const text = value => String(value ?? "").trim();
const slug = value => text(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export function prepareProductImport(rows, existing = []) {
  if (!Array.isArray(rows) || rows.length < 2) throw new Error("Products sheet is empty. Add your products below the headings.");
  if (rows.length > 1001) throw new Error("Import up to 1,000 rows at a time.");
  const headers = rows[0].map(text);
  for (const heading of importHeaders) if (!headers.includes(heading)) throw new Error(`Missing heading: ${heading}. Please use the template.`);
  const groups = new Map();
  const errors = [];
  rows.slice(1).forEach((row, index) => {
    if (!row.some(value => text(value))) return;
    const item = Object.fromEntries(importHeaders.map(heading => [heading, text(row[headers.indexOf(heading)])]));
    const line = index + 2;
    const fail = message => errors.push(`Row ${line}: ${message}`);
    const name = item[importHeaders[0]], sku = item[importHeaders[1]];
    const category = categories[item.Category.toLowerCase()];
    const numeric = (value, label, optional = false) => {
      if (!value && optional) return null;
      const number = Number(value.replace(/,/g, ""));
      if (!value || !Number.isFinite(number) || number < 0 || (label === "Stock" && !Number.isInteger(number))) { fail(`${label} must be a valid non-negative ${label === "Stock" ? "whole number" : "number"}.`); return null; }
      return number;
    };
    const price = numeric(item["Price (PKR)"], "Price");
    const oldPrice = numeric(item["Old price (PKR)"], "Old price", true);
    const stock = numeric(item["Stock / Pieces"], "Stock");
    if (!name || !sku) fail("Product name and product code are required.");
    if (!category) fail("Choose a category listed in the Guide sheet.");
    const status = (item.Status || "draft").toLowerCase();
    if (!["draft", "published"].includes(status)) fail("Status must be draft or published.");
    if (item.Featured && !["yes", "no"].includes(item.Featured.toLowerCase())) fail("Featured must be Yes or No.");
    const key = sku.toLowerCase();
    const hasVariant = Boolean(item.Size || item["Colour / Rang"] || item["Fabric / Kapra"]);
    const variant = { size: item.Size, color: item["Colour / Rang"], material: item["Fabric / Kapra"], stock, price: `PKR ${price}`, sku: "", image: "" };
    const product = { name, sku, category, price: `PKR ${price}`, oldPrice: oldPrice === null ? "" : `PKR ${oldPrice}`, stock, description: item["Description / Tafseel"], status, tag: item.Label || "New", featured: item.Featured.toLowerCase() === "yes", tags: item.Tags.split(",").map(text).filter(Boolean), slug: slug(name), variants: hasVariant ? [variant] : [], image: "", hoverImage: "", media: [] };
    if (!product.slug) fail("Product name must include a letter or number for its website link.");
    const previous = groups.get(key);
    if (previous) {
      if (!hasVariant || !previous.variants.length) fail("Repeated product code needs a size, colour or fabric on each row.");
      for (const field of ["name", "category", "price", "oldPrice", "description", "status", "tag", "featured"]) if (previous[field] !== product[field]) fail(`Keep ${field} the same for all rows of product ${sku}.`);
      if (previous.variants.some(v => v.size === variant.size && v.color === variant.color && v.material === variant.material)) fail("Duplicate size / colour / fabric for this product.");
      previous.variants.push(variant);
      previous.stock += stock || 0;
    } else groups.set(key, product);
  });
  const products = [...groups.values()];
  const usedSlugs = new Set();
  for (const product of products) {
    if (usedSlugs.has(product.slug)) errors.push(`Use different product names for different codes: ${product.name}`);
    usedSlugs.add(product.slug);
    if (existing.some(p => text(p.sku).toLowerCase() === product.sku.toLowerCase() || p.slug === product.slug)) errors.push(`Already exists: ${product.sku} (${product.name}). Use Edit for existing products.`);
  }
  if (!products.length && !errors.length) errors.push("Add at least one product below the headings.");
  return { products, errors };
}

