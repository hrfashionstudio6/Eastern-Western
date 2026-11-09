import { customerCarePages } from "./customer-care.js";
import { priceAmount } from "./money.js";
import { routeSlug } from "./route-slug.js";
export const SITE_URL = "https://easternwestern.net";
export const pageTitles = { "/": "Pakistani Clothing", "/shop": "Shop Women", "/bags": "Bags — Coming soon", "/fragrance": "Fragrance — Coming soon", "/checkout": "Checkout", ...Object.fromEntries(Object.entries(customerCarePages).map(([path, page]) => [path, page.title])) };
export const sitemapPaths = Object.keys(pageTitles).filter(path => !["/checkout", "/track-your-order"].includes(path));
export function pageSeo(pathname, products = []) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const article = path.startsWith("/shop/");
  const product = article ? products.find(p => (p.slug || p[2]) === routeSlug(path)) : null;
  const name = product?.name || product?.[1];
  const known = Object.hasOwn(pageTitles, path) || Boolean(product) || path === "/admin";
  const noindex = !known || path.startsWith("/admin") || ["/checkout", "/track-your-order", "/bags", "/fragrance"].includes(path);
  const title = `${name || pageTitles[path] || (path.startsWith("/admin") ? "Admin" : "Page not found")} | Eastern Western`;
  const description = product ? `Shop ${name} by Eastern Western${product.category ? ` — ${product.category}` : ""}. View article photos, sizes and prices in PKR. Free delivery across Pakistan. Cash on Delivery available.` : path === "/" ? "Explore Eastern Western Pakistani ready-to-wear clothing. Shop the Winter '26 collection with free delivery across Pakistan and Cash on Delivery." : `${pageTitles[path] || "Page not found"} at Eastern Western. Explore Pakistani clothing, article details and customer care. Free delivery across Pakistan.`;
  const canonical = SITE_URL + (product ? "/shop/" + encodeURIComponent(product.slug || product[2]) : path);
  const image = new URL(product?.image || product?.[5] || "/assets/hero-banner-1.jpg", SITE_URL).href;
  const schema = product ? { "@context": "https://schema.org", "@type": "Product", name, image: [image], description, url: canonical, brand: { "@type": "Brand", name: "Eastern Western" }, ...(product.sku ? { sku: product.sku } : {}), offers: { "@type": "Offer", url: canonical, priceCurrency: "PKR", price: priceAmount(product.price || product[3]), itemCondition: "https://schema.org/NewCondition" } } : path === "/" ? { "@context": "https://schema.org", "@type": "Organization", name: "Eastern Western", url: SITE_URL, logo: SITE_URL + "/assets/easternwestern-logo.png", sameAs: ["https://www.instagram.com/easternwesternfashion/"] } : null;
  return { title, description, canonical, image, schema, noindex, known };
}
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export function seoHead(seo) {
  const meta = (key, value, property = false) => `<meta ${property ? "property" : "name"}="${key}" content="${escapeHtml(value)}">`;
  return `<title>${escapeHtml(seo.title)}</title>` + meta("description", seo.description) + `<link rel="canonical" href="${escapeHtml(seo.canonical)}">` + meta("robots", seo.noindex ? "noindex,follow" : "index,follow") + meta("og:title", seo.title, true) + meta("og:description", seo.description, true) + meta("og:url", seo.canonical, true) + meta("og:image", seo.image, true) + meta("og:type", seo.schema?.["@type"] === "Product" ? "product" : "website", true) + meta("twitter:card", "summary_large_image") + (seo.schema ? `<script id="page-schema" type="application/ld+json">${JSON.stringify(seo.schema).replace(/</g, "\\u003c")}</script>` : "");
}
export function renderSeo(html, seo) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, "").replace(/<meta\s+name=["']description["'][^>]*>/i, "").replace("</head>", seoHead(seo) + "</head>");
}
export function sitemapXml(products) {
  const urls = [...sitemapPaths.filter(path => !["/bags", "/fragrance"].includes(path)), ...products.map(p => "/shop/" + encodeURIComponent(p.slug))];
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map(path => `<url><loc>${escapeHtml(SITE_URL + path)}</loc></url>`).join("") + '</urlset>';
}
