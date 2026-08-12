import { useEffect, useState } from "react";
import "./admin.css";

const tabs = ["Overview", "Listings", "Orders", "Site Editor", "Blogs", "Settings"];
const tabIcons = {
  Overview: "M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-12h8V3h-8v6Z",
  Listings: "M4 5h16v4H4V5Zm0 6h16v8H4v-8Zm3 2v4m10-4v4",
  Orders: "M7 7h14l-2 8H8L7 7Zm0 0L6 4H3m6 15a1 1 0 1 0 0 .1m8-.1a1 1 0 1 0 0 .1",
  "Site Editor": "M4 5h16v14H4V5Zm4 4h8m-8 4h5m5-8v14",
  Blogs: "M5 4h10l4 4v12H5V4Zm9 0v5h5M8 13h8M8 17h8",
  Settings: "M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Zm0-12v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.95-6.45-1.41 1.41M6.96 17.04l-1.41 1.41m12.9 0-1.41-1.41M6.96 6.96 5.55 5.55",
  Logout: "M10 17l5-5-5-5m5 5H3m8-9h8v18h-8",
};
const sectionIcons = {
  offerBar: "M4 7h16v10H4V7Zm3 0v10m10-10v10M8 12h8",
  homeHero: "M4 19V9l8-6 8 6v10h-5v-6H9v6H4Z",
  homeAbout: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  newArrivals: "M12 3l2.4 5 5.6.8-4 3.9.9 5.5L12 15.4 7.1 18l.9-5.5-4-3.9 5.6-.8L12 3Z",
  bestSellers: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Zm0 2H4v2a3 3 0 0 0 3 3m10-5h3v2a3 3 0 0 1-3 3",
  collections: "M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v5H4v-5Zm9 0h7v5h-7v-5Z",
  review: "M5 5h14v10H8l-3 3V5Zm4 4h6m-6 3h4",
  features: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Zm6 11 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z",
  homeBlog: "M5 4h10l4 4v12H5V4Zm9 0v5h5M8 13h8M8 17h8",
  social: "M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6-9 3 2m-7 2 1-3",
  aboutHero: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  aboutTrust: "M12 3l7 4v5c0 4.4-2.9 7.5-7 9-4.1-1.5-7-4.6-7-9V7l7-4Zm-3 9 2 2 4-5",
  aboutStats: "M4 19V9m6 10V5m6 14v-7m4 7H2",
  shopHero: "M6 8h12l-1 12H7L6 8Zm3 0a3 3 0 0 1 6 0",
  shopListings: "M4 5h16v4H4V5Zm0 6h16v8H4v-8Zm3 2v4m10-4v4",
  blogHero: "M5 4h10l4 4v12H5V4Zm9 0v5h5",
  blogList: "M5 6h14M5 12h14M5 18h14",
  contactHero: "M4 5h16v14H4V5Zm2 3 6 5 6-5",
  contactInfo: "M12 21s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  footer: "M4 17h16M4 7h16M6 7v10m12-10v10",
};
const productCategories = ["UNSTITCHED NEW IN", "READY TO WEAR", "FABRIC NEW IN", "Men's Wear", "Women's Wear", "Children's Wear"];
const productTags = ["New", "Best seller", "Save 25%", "New In", "Fabric"];
const blankProduct = { tag: "New", name: "", slug: "", category: "UNSTITCHED NEW IN", sku: "", price: "", oldPrice: "", image: "", hoverImage: "", mediaText: "", tagsText: "", variantsText: "", description: "", stock: 0, status: "published", featured: false, sortOrder: 0 };
const blankBlog = { category: "Style Guide", title: "", slug: "", excerpt: "", readTime: "5 min read", date: "", image: "", body: "", status: "published", sortOrder: 0 };
const siteEditorSections = [
  { id: "offerBar", label: "Offer bar", page: "/", hash: "offer-bar" },
  { id: "homeHero", label: "Home hero", page: "/", hash: "home-hero" },
  { id: "homeAbout", label: "Home about", page: "/", hash: "about" },
  { id: "newArrivals", label: "New arrivals", page: "/", hash: "new-arrivals" },
  { id: "bestSellers", label: "Best sellers", page: "/", hash: "best-sellers" },
  { id: "collections", label: "Collections", page: "/", hash: "collections" },
  { id: "review", label: "Reviews", page: "/", hash: "reviews" },
  { id: "features", label: "Features", page: "/", hash: "features" },
  { id: "homeBlog", label: "Home blog", page: "/", hash: "home-blog" },
  { id: "social", label: "Social", page: "/", hash: "social" },
  { id: "aboutHero", label: "About hero", page: "/about", hash: "about-hero" },
  { id: "aboutTrust", label: "About trust", page: "/about", hash: "about-trust" },
  { id: "aboutStats", label: "About stats", page: "/about", hash: "about-stats" },
  { id: "shopHero", label: "Shop hero", page: "/shop", hash: "shop-hero" },
  { id: "shopListings", label: "Shop listings", page: "/shop", hash: "shop-listings" },
  { id: "blogHero", label: "Blog hero", page: "/blog", hash: "blog-hero" },
  { id: "blogList", label: "Blog list", page: "/blog", hash: "blog-list" },
  { id: "contactHero", label: "Contact hero", page: "/contact", hash: "contact-hero" },
  { id: "contactInfo", label: "Contact info", page: "/contact", hash: "contact-info" },
  { id: "footer", label: "Footer", page: "/", hash: "footer" },
];

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminIcon({ name }) {
  return (
    <svg className="admin-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={tabIcons[name]} />
    </svg>
  );
}

function SectionIcon({ id }) {
  return (
    <svg className="editor-section-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={sectionIcons[id] || sectionIcons.homeHero} />
    </svg>
  );
}

function lines(value) {
  return String(value || "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function variantsFromText(value) {
  return String(value || "").split(/\r?\n/).map((line) => {
    const [size, color, sku, price, stock, image, material] = line.split("|").map((part) => part?.trim() || "");
    return { size, color, sku, price, stock: Number(stock) || 0, image, material };
  }).filter((variant) => variant.size || variant.color || variant.sku || variant.material);
}

function variantsToText(variants = []) {
  return variants.map((variant) => [variant.size, variant.color, variant.sku, variant.price, variant.stock, variant.image, variant.material].map((value) => value || "").join("|")).join("\n");
}

function productToForm(product) {
  return {
    ...blankProduct,
    ...product,
    mediaText: (product.media || []).join("\n"),
    tagsText: (product.tags || []).join(", "),
    variantsText: variantsToText(product.variants || []),
  };
}

function countBy(items, pickKey) {
  return items.reduce((counts, item) => {
    const key = pickKey(item) || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function chartRows(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function weeklyRevenueRows(orders) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return { date, label: date.toLocaleDateString("en-US", { weekday: "short" }), value: 0 };
  });
  orders.forEach((order) => {
    const created = order.createdAt ? new Date(order.createdAt) : null;
    if (!created || Number.isNaN(created.getTime())) return;
    created.setHours(0, 0, 0, 0);
    const row = days.find((day) => day.date.getTime() === created.getTime());
    if (row) row.value += Number(order.subtotal || 0);
  });
  return days;
}

function donutGradient(rows, total) {
  if (!total) return "#ededeb";
  const colors = ["#050505", "#6f6f67", "#b9b39f", "#ded7bf", "#9aa196"];
  let start = 0;
  return `conic-gradient(${rows.map(([, value], index) => {
    const end = start + (value / total) * 100;
    const segment = `${colors[index % colors.length]} ${start}% ${end}%`;
    start = end;
    return segment;
  }).join(", ")})`;
}

function collectionsFromText(value) {
  return String(value || "").split(/\r?\n/).map((line) => {
    const [tag, name, title, text, price, oldPrice, image] = line.split("|").map((part) => part?.trim() || "");
    return { tag, name, title, text, price, oldPrice, image };
  }).filter((item) => item.name || item.title || item.image);
}

function collectionsToText(collections = []) {
  return collections.map((item) => [item.tag, item.name, item.title, item.text, item.price, item.oldPrice, item.image].map((value) => value || "").join("|")).join("\n");
}

function featureCardsFromText(value) {
  return String(value || "").split(/\r?\n/).map((line) => {
    const [title, text, tags, image] = line.split("|").map((part) => part?.trim() || "");
    return { title, text, tags: tags ? lines(tags) : [], image };
  }).filter((item) => item.title || item.text || item.image);
}

function featureCardsToText(cards = []) {
  return cards.map((item) => [item.title, item.text, (item.tags || []).join(", "), item.image].map((value) => value || "").join("|")).join("\n");
}

function statCardsFromText(value) {
  return String(value || "").split(/\r?\n/).map((line) => {
    const [value, label, image] = line.split("|").map((part) => part?.trim() || "");
    return { value, label, image };
  }).filter((item) => item.value || item.label || item.image);
}

function statCardsToText(cards = []) {
  return cards.map((item) => [item.value, item.label, item.image].map((value) => value || "").join("|")).join("\n");
}

function appendTextLine(value, line) {
  return [String(value || "").trimEnd(), line].filter(Boolean).join("\n");
}

function compactImages(images = []) {
  return images.map((image) => String(image || "").trim()).filter(Boolean);
}

function compactHeroSlides(slides = []) {
  return slides.map((slide) => ({
    label: String(slide.label || "").trim(),
    image: String(slide.image || "").trim(),
  })).filter((slide) => slide.label || slide.image);
}

function compactCollections(collections = []) {
  return collections.map((item) => ({
    tag: String(item.tag || "").trim(),
    name: String(item.name || "").trim(),
    title: String(item.title || "").trim(),
    text: String(item.text || "").trim(),
    price: String(item.price || "").trim(),
    oldPrice: String(item.oldPrice || "").trim(),
    image: String(item.image || "").trim(),
  })).filter((item) => item.name || item.title || item.image);
}

function compactFeatureCards(cards = []) {
  return cards.map((item) => ({
    title: String(item.title || "").trim(),
    text: String(item.text || "").trim(),
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag || "").trim()).filter(Boolean) : lines(item.tags),
    image: String(item.image || "").trim(),
  })).filter((item) => item.title || item.text || item.image);
}

function compactStatCards(cards = []) {
  return cards.map((item) => ({
    value: String(item.value || "").trim(),
    label: String(item.label || "").trim(),
    image: String(item.image || "").trim(),
  })).filter((item) => item.value || item.label || item.image);
}

function compactReviewItems(items = []) {
  return items.map((item) => ({
    rating: String(item.rating || "").trim(),
    summary: String(item.summary || "").trim(),
    quote: String(item.quote || "").trim(),
    name: String(item.name || "").trim(),
    role: String(item.role || "").trim(),
    image: String(item.image || "").trim(),
  })).filter((item) => item.quote || item.name || item.image);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

async function request(path, token, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem("ew-admin-token") || "");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("Overview");
  const [data, setData] = useState({ content: { settings: {}, heroSlides: [] }, products: [], blogs: [], orders: [] });
  const [message, setMessage] = useState("");
  const [productForm, setProductForm] = useState(blankProduct);
  const [blogForm, setBlogForm] = useState(blankBlog);
  const [settings, setSettings] = useState({});
  const [pageHeroes, setPageHeroes] = useState({});
  const [sections, setSections] = useState({});
  const [collections, setCollections] = useState([]);
  const [featureCards, setFeatureCards] = useState([]);
  const [reviewItems, setReviewItems] = useState([]);
  const [statCards, setStatCards] = useState([]);
  const [avatarImages, setAvatarImages] = useState([]);
  const [brandImages, setBrandImages] = useState([]);
  const [socialImages, setSocialImages] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [editorSection, setEditorSection] = useState("homeHero");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [uploadingField, setUploadingField] = useState("");

  async function load() {
    if (!token) return;
    try {
      const payload = await request("/api/admin/dashboard", token);
      setData(payload);
      setSettings(payload.content?.settings || {});
      setPageHeroes(payload.content?.pageHeroes || {});
      setSections(payload.content?.sections || {});
      setCollections(payload.content?.collections || []);
      setFeatureCards(payload.content?.featureCards || []);
      setReviewItems(payload.content?.reviewItems || []);
      setStatCards(payload.content?.statCards || []);
      setAvatarImages(payload.content?.avatarImages || []);
      setBrandImages(payload.content?.brandImages || []);
      setSocialImages(payload.content?.socialImages || []);
      setHeroSlides(payload.content?.heroSlides || []);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  async function login(event) {
    event.preventDefault();
    try {
      const payload = await request("/api/admin/login", "", { method: "POST", body: JSON.stringify({ password }) });
      localStorage.setItem("ew-admin-token", payload.token);
      setToken(payload.token);
      setPassword("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function uploadImage(file, field, applyUrl) {
    if (!file) return;
    setUploadingField(field);
    try {
      const dataUrl = await fileToDataUrl(file);
      const payload = await request("/api/admin/uploads", token, {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, dataUrl }),
      });
      applyUrl(payload.url);
      setMessage("Image uploaded");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploadingField("");
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    try {
      const { mediaText, tagsText, variantsText, ...cleanForm } = productForm;
      const body = {
        ...cleanForm,
        slug: productForm.slug || slugify(productForm.name),
        media: lines(mediaText),
        tags: lines(tagsText),
        variants: variantsFromText(variantsText),
      };
      const url = productForm.id ? `/api/admin/products/${productForm.id}` : "/api/admin/products";
      await request(url, token, { method: productForm.id ? "PUT" : "POST", body: JSON.stringify(body) });
      setProductForm(blankProduct);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveBlog(event) {
    event.preventDefault();
    try {
      const body = { ...blogForm, slug: blogForm.slug || slugify(blogForm.title) };
      const url = blogForm.id ? `/api/admin/blogs/${blogForm.id}` : "/api/admin/blogs";
      await request(url, token, { method: blogForm.id ? "PUT" : "POST", body: JSON.stringify(body) });
      setBlogForm(blankBlog);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveContent(event) {
    event?.preventDefault();
    try {
      await request("/api/admin/content", token, {
        method: "PUT",
        body: JSON.stringify({
          ...data.content,
          settings,
          pageHeroes,
          sections,
          heroSlides: compactHeroSlides(heroSlides),
          featureCards: compactFeatureCards(featureCards),
          reviewItems: compactReviewItems(reviewItems),
          statCards: compactStatCards(statCards),
          avatarImages: compactImages(avatarImages),
          brandImages: compactImages(brandImages),
          collections: compactCollections(collections),
          socialImages: compactImages(socialImages),
        }),
      });
      setPreviewKey((key) => key + 1);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updatePageHero(key, field, value) {
    setPageHeroes((current) => ({ ...current, [key]: { ...(current[key] || {}), [field]: value } }));
  }

  function updateSection(key, field, value) {
    setSections((current) => ({ ...current, [key]: { ...(current[key] || {}), [field]: value } }));
  }

  function updateListItem(setter, index, field, value) {
    setter((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function updateImageItem(setter, index, value) {
    setter((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  }

  function removeListItem(setter, index) {
    setter((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function addListItem(setter, item) {
    setter((current) => [...current, item]);
  }

  async function remove(kind, id) {
    try {
      await request(`/api/admin/${kind}/${id}`, token, { method: "DELETE" });
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateOrder(order, updates) {
    try {
      await request(`/api/admin/orders/${order.id}`, token, { method: "PATCH", body: JSON.stringify(updates) });
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function heroFields(key) {
    const hero = pageHeroes[key] || {};
    return (
      <>
        {["kicker", "companion", "title", "text", "image"].map((field) => (
          field === "image"
            ? <ImageInput key={field} label={field} value={hero[field] || ""} uploading={uploadingField === `hero-${key}-${field}`} onChange={(value) => updatePageHero(key, field, value)} onUpload={(file) => uploadImage(file, `hero-${key}-${field}`, (url) => updatePageHero(key, field, url))} />
            : field === "text"
            ? <textarea key={field} value={hero[field] || ""} onChange={(event) => updatePageHero(key, field, event.target.value)} placeholder={field} />
            : <input key={field} value={hero[field] || ""} onChange={(event) => updatePageHero(key, field, event.target.value)} placeholder={field} />
        ))}
      </>
    );
  }

  function sectionFields(key, fields) {
    const section = sections[key] || {};
    return fields.map((field) => (
      ["image", "logo", "poster", "emailIcon", "phoneIcon", "addressIcon"].includes(field)
        ? <ImageInput key={field} label={field} value={section[field] || ""} uploading={uploadingField === `section-${key}-${field}`} onChange={(value) => updateSection(key, field, value)} onUpload={(file) => uploadImage(file, `section-${key}-${field}`, (url) => updateSection(key, field, url))} />
        : ["text", "quote"].includes(field)
        ? <textarea key={field} value={section[field] || ""} onChange={(event) => updateSection(key, field, event.target.value)} placeholder={field} />
        : <input key={field} value={section[field] || ""} onChange={(event) => updateSection(key, field, event.target.value)} placeholder={field} />
    ));
  }

  function renderSiteEditor() {
    if (editorSection === "offerBar") {
      return (
        <>
          <label className="admin-check"><input type="checkbox" checked={settings.offerEnabled !== false} onChange={(event) => setSettings({ ...settings, offerEnabled: event.target.checked })} /> Show offer bar</label>
          <input value={settings.offerText || ""} onChange={(event) => setSettings({ ...settings, offerText: event.target.value })} placeholder="Offer text" />
        </>
      );
    }
    if (editorSection === "homeHero") {
      return (
        <>
          {["heroKicker", "heroCompanion", "heroTitle", "heroText"].map((field) => (
            field === "heroText" || field === "heroTitle"
              ? <textarea key={field} value={settings[field] || ""} onChange={(event) => setSettings({ ...settings, [field]: event.target.value })} placeholder={field} />
              : <input key={field} value={settings[field] || ""} onChange={(event) => setSettings({ ...settings, [field]: event.target.value })} placeholder={field} />
          ))}
          <SlideEditor
            slides={heroSlides}
            uploadingField={uploadingField}
            onAdd={() => addListItem(setHeroSlides, { label: "Slide", image: "" })}
            onRemove={(index) => removeListItem(setHeroSlides, index)}
            onChange={(index, field, value) => updateListItem(setHeroSlides, index, field, value)}
            onUpload={(index, file) => uploadImage(file, `hero-slide-${index}`, (url) => updateListItem(setHeroSlides, index, "image", url))}
          />
        </>
      );
    }
    if (editorSection === "homeAbout") return sectionFields("about", ["logo", "poster", "year", "title", "text"]);
    if (editorSection === "newArrivals") return <EditorNote title="New arrivals" text="Products with tag New appear here. Edit them from Listings." />;
    if (editorSection === "bestSellers") return <EditorNote title="Best sellers" text="Products with tag Best seller appear here. Edit them from Listings." />;
    if (editorSection === "aboutHero") return heroFields("about");
    if (editorSection === "aboutTrust") {
      return (
        <>
          {sectionFields("aboutTrust", ["rating", "text"])}
          <ImageListEditor
            title="Avatar images"
            images={avatarImages}
            uploadKey="avatar-images"
            uploadingField={uploadingField}
            onAdd={() => addListItem(setAvatarImages, "")}
            onRemove={(index) => removeListItem(setAvatarImages, index)}
            onChange={(index, value) => updateImageItem(setAvatarImages, index, value)}
            onUpload={(index, file) => uploadImage(file, `avatar-images-${index}`, (url) => updateImageItem(setAvatarImages, index, url))}
          />
          <ImageListEditor
            title="Brand images"
            images={brandImages}
            uploadKey="brand-images"
            uploadingField={uploadingField}
            onAdd={() => addListItem(setBrandImages, "")}
            onRemove={(index) => removeListItem(setBrandImages, index)}
            onChange={(index, value) => updateImageItem(setBrandImages, index, value)}
            onUpload={(index, file) => uploadImage(file, `brand-images-${index}`, (url) => updateImageItem(setBrandImages, index, url))}
          />
        </>
      );
    }
    if (editorSection === "aboutStats") {
      return (
        <>
          {sectionFields("aboutStats", ["kicker", "title"])}
          <StatCardsEditor
            cards={statCards}
            uploadingField={uploadingField}
            onAdd={() => addListItem(setStatCards, { value: "", label: "", image: "" })}
            onRemove={(index) => removeListItem(setStatCards, index)}
            onChange={(index, field, value) => updateListItem(setStatCards, index, field, value)}
            onUpload={(index, file) => uploadImage(file, `stat-card-${index}`, (url) => updateListItem(setStatCards, index, "image", url))}
          />
        </>
      );
    }
    if (editorSection === "shopHero") return heroFields("shop");
    if (editorSection === "shopListings") return <EditorNote title="Shop listings" text="Shop products are controlled from Listings." />;
    if (editorSection === "blogHero") return heroFields("blog");
    if (editorSection === "blogList") return <EditorNote title="Blog list" text="Blog cards are controlled from Blogs." />;
    if (editorSection === "contactHero") return heroFields("contact");
    if (editorSection === "contactInfo") {
      return (
        <>
          {["contactEmail", "contactPhone", "contactAddress"].map((field) => <input key={field} value={settings[field] || ""} onChange={(event) => setSettings({ ...settings, [field]: event.target.value })} placeholder={field} />)}
          {sectionFields("contactInfo", ["emailIcon", "phoneIcon", "addressIcon", "image"])}
        </>
      );
    }
    if (editorSection === "collections") {
      return (
        <CollectionsEditor
          collections={collections}
          uploadingField={uploadingField}
          onAdd={() => addListItem(setCollections, { tag: "New", name: "", title: "", text: "", price: "", oldPrice: "", image: "" })}
          onRemove={(index) => removeListItem(setCollections, index)}
          onChange={(index, field, value) => updateListItem(setCollections, index, field, value)}
          onUpload={(index, file) => uploadImage(file, `collection-${index}`, (url) => updateListItem(setCollections, index, "image", url))}
        />
      );
    }
    if (editorSection === "review") {
      return (
        <>
          {sectionFields("review", ["kicker", "title", "text"])}
          <ReviewItemsEditor
            items={reviewItems}
            uploadingField={uploadingField}
            onAdd={() => addListItem(setReviewItems, { rating: "5.0/5", summary: "", quote: "", name: "", role: "", image: "" })}
            onRemove={(index) => removeListItem(setReviewItems, index)}
            onChange={(index, field, value) => updateListItem(setReviewItems, index, field, value)}
            onUpload={(index, file) => uploadImage(file, `review-item-${index}`, (url) => updateListItem(setReviewItems, index, "image", url))}
          />
        </>
      );
    }
    if (editorSection === "features") {
      return (
        <>
          {sectionFields("features", ["kicker", "title", "text"])}
          <FeatureCardsEditor
            cards={featureCards}
            uploadingField={uploadingField}
            onAdd={() => addListItem(setFeatureCards, { title: "", text: "", tags: [], image: "" })}
            onRemove={(index) => removeListItem(setFeatureCards, index)}
            onChange={(index, field, value) => updateListItem(setFeatureCards, index, field, value)}
            onUpload={(index, file) => uploadImage(file, `feature-card-${index}`, (url) => updateListItem(setFeatureCards, index, "image", url))}
          />
        </>
      );
    }
    if (editorSection === "homeBlog") return sectionFields("blogList", ["kicker", "title"]);
    if (editorSection === "social") {
      return (
        <>
          {sectionFields("social", ["kicker", "title", "text"])}
          <ImageListEditor
            title="Social images"
            images={socialImages}
            uploadKey="social-images"
            uploadingField={uploadingField}
            onAdd={() => addListItem(setSocialImages, "")}
            onRemove={(index) => removeListItem(setSocialImages, index)}
            onChange={(index, value) => updateImageItem(setSocialImages, index, value)}
            onUpload={(index, file) => uploadImage(file, `social-images-${index}`, (url) => updateImageItem(setSocialImages, index, url))}
          />
        </>
      );
    }
    return ["brandName", "logoUrl", "faviconUrl", "footerText", "contactEmail", "contactPhone", "contactAddress"].map((field) => (
      ["logoUrl", "faviconUrl"].includes(field)
        ? <ImageInput key={field} label={field} value={settings[field] || ""} uploading={uploadingField === `settings-${field}`} onChange={(value) => setSettings({ ...settings, [field]: value })} onUpload={(file) => uploadImage(file, `settings-${field}`, (url) => setSettings((current) => ({ ...current, [field]: url })))} />
        : field === "footerText"
        ? <textarea key={field} value={settings[field] || ""} onChange={(event) => setSettings({ ...settings, [field]: event.target.value })} placeholder={field} />
        : <input key={field} value={settings[field] || ""} onChange={(event) => setSettings({ ...settings, [field]: event.target.value })} placeholder={field} />
    ));
  }

  if (!token) {
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <img src="/assets/easternwestern-logo.png" alt="" />
          <h1>EasternWestern Admin</h1>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" />
          <button type="submit">Login</button>
          {message && <p>{message}</p>}
        </form>
      </main>
    );
  }

  const revenue = data.orders.reduce((sum, order) => sum + Number(order.subtotal || 0), 0);
  const weeklyRevenue = weeklyRevenueRows(data.orders);
  const maxWeeklyRevenue = Math.max(...weeklyRevenue.map((row) => row.value), 1);
  const orderStatusRows = chartRows(countBy(data.orders, (order) => order.status || "pending"));
  const categoryRows = chartRows(countBy(data.products, (product) => product.category || "Uncategorized"));
  const maxCategoryCount = Math.max(...categoryRows.map(([, count]) => count), 1);
  const stockRows = data.products
    .slice()
    .sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
    .slice(0, 5);
  const maxStock = Math.max(...stockRows.map((product) => Number(product.stock || 0)), 1);
  const selectedEditor = siteEditorSections.find((section) => section.id === editorSection) || siteEditorSections[0];
  const previewSrc = `${selectedEditor.page}?preview=${previewKey}#${selectedEditor.hash}`;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/"><img src="/assets/easternwestern-logo.png" alt="" /><span>EasternWestern</span></a>
        {tabs.map((tab) => <button className={active === tab ? "active" : ""} onClick={() => setActive(tab)} key={tab}><AdminIcon name={tab} /><span>{tab}</span></button>)}
        <button onClick={() => { localStorage.removeItem("ew-admin-token"); setToken(""); }}><AdminIcon name="Logout" /><span>Logout</span></button>
      </aside>

      <section className="admin-main">
        <header><div><small>Admin dashboard</small><h1>{active}</h1></div><a href="/">View site</a></header>
        {message && <p className="admin-message">{message}</p>}

        {active === "Overview" && (
          <>
            <div className="admin-cards">
              <article><span>Listings</span><b>{data.products.length}</b></article>
              <article><span>Blogs</span><b>{data.blogs.length}</b></article>
              <article><span>Orders</span><b>{data.orders.length}</b></article>
              <article><span>Revenue</span><b>${revenue.toFixed(2)}</b></article>
            </div>
            <div className="overview-charts">
              <article className="chart-card chart-wide">
                <div className="chart-head"><div><span>Sales graph</span><h3>Revenue this week</h3></div><b>${revenue.toFixed(2)}</b></div>
                <div className="bar-chart">
                  {weeklyRevenue.map((row) => <div className="bar-column" key={row.label}><i style={{ height: `${Math.max(8, (row.value / maxWeeklyRevenue) * 100)}%` }} /><span>{row.label}</span></div>)}
                </div>
              </article>
              <article className="chart-card">
                <div className="chart-head"><div><span>Orders</span><h3>Status chart</h3></div><b>{data.orders.length}</b></div>
                <div className="donut-wrap">
                  <div className="donut-chart" style={{ background: donutGradient(orderStatusRows, data.orders.length) }}><span>{data.orders.length}</span></div>
                  <div className="chart-legend">{orderStatusRows.length ? orderStatusRows.map(([label, count]) => <p key={label}><i />{label}<b>{count}</b></p>) : <p><i />No orders<b>0</b></p>}</div>
                </div>
              </article>
              <article className="chart-card">
                <div className="chart-head"><div><span>Listings</span><h3>Category chart</h3></div><b>{data.products.length}</b></div>
                <div className="horizontal-bars">
                  {categoryRows.map(([label, count]) => <div key={label}><p><span>{label}</span><b>{count}</b></p><i><em style={{ width: `${(count / maxCategoryCount) * 100}%` }} /></i></div>)}
                </div>
              </article>
              <article className="chart-card chart-wide">
                <div className="chart-head"><div><span>Inventory</span><h3>Top stock products</h3></div><b>{stockRows.reduce((sum, item) => sum + Number(item.stock || 0), 0)}</b></div>
                <div className="stock-bars">
                  {stockRows.map((product) => <div key={product.id || product.slug}><span>{product.name}</span><i><em style={{ width: `${(Number(product.stock || 0) / maxStock) * 100}%` }} /></i><b>{product.stock || 0}</b></div>)}
                </div>
              </article>
            </div>
          </>
        )}

        {active === "Listings" && (
          <AdminPanel title={productForm.id ? "Edit listing" : "Add listing"}>
            <form className="admin-form" onSubmit={saveProduct}>
              {["name", "slug", "sku", "price", "oldPrice"].map((field) => <input key={field} value={productForm[field] || ""} onChange={(event) => setProductForm({ ...productForm, [field]: event.target.value })} placeholder={field} />)}
              <ImageInput label="image" value={productForm.image || ""} uploading={uploadingField === "product-image"} onChange={(value) => setProductForm({ ...productForm, image: value })} onUpload={(file) => uploadImage(file, "product-image", (url) => setProductForm((current) => ({ ...current, image: url })))} />
              <ImageInput label="hoverImage" value={productForm.hoverImage || ""} uploading={uploadingField === "product-hover"} onChange={(value) => setProductForm({ ...productForm, hoverImage: value })} onUpload={(file) => uploadImage(file, "product-hover", (url) => setProductForm((current) => ({ ...current, hoverImage: url })))} />
              <select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>{productCategories.map((x) => <option key={x}>{x}</option>)}</select>
              <select value={productForm.tag} onChange={(event) => setProductForm({ ...productForm, tag: event.target.value })}>{productTags.map((x) => <option key={x}>{x}</option>)}</select>
              <select value={productForm.status} onChange={(event) => setProductForm({ ...productForm, status: event.target.value })}>{["published", "draft"].map((x) => <option key={x}>{x}</option>)}</select>
              <input type="number" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} placeholder="stock" />
              <input type="number" value={productForm.sortOrder} onChange={(event) => setProductForm({ ...productForm, sortOrder: event.target.value })} placeholder="sort order" />
              <label className="admin-check"><input type="checkbox" checked={Boolean(productForm.featured)} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} /> Featured</label>
              <textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="description" />
              <UploadTextarea value={productForm.mediaText} uploading={uploadingField === "product-media"} onChange={(value) => setProductForm({ ...productForm, mediaText: value })} onUpload={(file) => uploadImage(file, "product-media", (url) => setProductForm((current) => ({ ...current, mediaText: appendTextLine(current.mediaText, url) })))} placeholder="media images, one URL per line" />
              <textarea value={productForm.tagsText} onChange={(event) => setProductForm({ ...productForm, tagsText: event.target.value })} placeholder="tags, comma separated" />
              <UploadTextarea value={productForm.variantsText} uploading={uploadingField === "product-variants"} onChange={(value) => setProductForm({ ...productForm, variantsText: value })} onUpload={(file) => uploadImage(file, "product-variants", (url) => setProductForm((current) => ({ ...current, variantsText: appendTextLine(current.variantsText, `||||0|${url}|`) })))} placeholder="variant lines: size|color|sku|price|stock|image|material" />
              <button>{productForm.id ? "Update listing" : "Add listing"}</button>
            </form>
            <div className="listing-list-head">
              <h3>Product list</h3>
              <span>{data.products.length} items</span>
            </div>
            <AdminTable rows={data.products} fields={["image", "name", "price", "category", "status"]} onEdit={(row) => setProductForm(productToForm(row))} onDelete={(id) => remove("products", id)} />
          </AdminPanel>
        )}

        {active === "Site Editor" && (
          <AdminPanel title="Site editor">
            <div className="site-editor">
              <nav className="editor-list">
                {siteEditorSections.map((section) => <button type="button" className={editorSection === section.id ? "active" : ""} onClick={() => setEditorSection(section.id)} key={section.id}><SectionIcon id={section.id} /><span>{section.label}</span></button>)}
              </nav>
              <div className={`editor-preview editor-preview-${previewMode}`}>
                <div className="editor-preview-bar">
                  <b>{selectedEditor.label}</b>
                  <div>{["desktop", "tablet", "mobile"].map((mode) => <button type="button" className={previewMode === mode ? "active" : ""} onClick={() => setPreviewMode(mode)} key={mode}>{mode}</button>)}</div>
                </div>
                <iframe key={`${previewKey}-${editorSection}-${previewMode}`} src={previewSrc} title="Site preview" />
              </div>
              <aside className="editor-drawer" key={editorSection}>
                <form className="admin-form editor-inspector" onSubmit={saveContent}>
                  <div className="editor-drawer-head">
                    <SectionIcon id={selectedEditor.id} />
                    <h3>{selectedEditor.label}</h3>
                  </div>
                  {renderSiteEditor()}
                  <button>Save changes</button>
                </form>
              </aside>
            </div>
          </AdminPanel>
        )}

        {active === "Blogs" && (
          <AdminPanel title={blogForm.id ? "Edit blog" : "Add blog"}>
            <form className="admin-form" onSubmit={saveBlog}>
              {["title", "slug", "category", "readTime", "date"].map((field) => <input key={field} value={blogForm[field] || ""} onChange={(event) => setBlogForm({ ...blogForm, [field]: event.target.value })} placeholder={field} />)}
              <ImageInput label="image" value={blogForm.image || ""} uploading={uploadingField === "blog-image"} onChange={(value) => setBlogForm({ ...blogForm, image: value })} onUpload={(file) => uploadImage(file, "blog-image", (url) => setBlogForm((current) => ({ ...current, image: url })))} />
              <select value={blogForm.status} onChange={(event) => setBlogForm({ ...blogForm, status: event.target.value })}>{["published", "draft"].map((x) => <option key={x}>{x}</option>)}</select>
              <textarea value={blogForm.excerpt} onChange={(event) => setBlogForm({ ...blogForm, excerpt: event.target.value })} placeholder="excerpt" />
              <textarea value={blogForm.body} onChange={(event) => setBlogForm({ ...blogForm, body: event.target.value })} placeholder="body" />
              <button>{blogForm.id ? "Update blog" : "Add blog"}</button>
            </form>
            <AdminTable rows={data.blogs} fields={["title", "category", "status", "date"]} onEdit={setBlogForm} onDelete={(id) => remove("blogs", id)} />
          </AdminPanel>
        )}

        {active === "Orders" && (
          <AdminPanel title="Orders">
            <div className="admin-orders">
              {data.orders.length ? data.orders.map((order) => (
                <article key={order.id}>
                  <div className="order-main">
                    <b>{order.orderNo}</b>
                    <span>{order.customer?.name} - {order.customer?.phone}</span>
                    <small>{order.customer?.email}</small>
                    <small>{order.customer?.address}</small>
                    <small>{order.items?.map((item) => `${item.name} x${item.qty}`).join(", ")}</small>
                  </div>
                  <div className="order-payment">
                    <b>${Number(order.subtotal || 0).toFixed(2)}</b>
                    <span>{order.paymentMethod || "Cash on Delivery"}</span>
                    <span>{order.items?.length || 0} items</span>
                    {order.paymentProofUrl && <a href={order.paymentProofUrl} target="_blank" rel="noreferrer"><img src={order.paymentProofUrl} alt="Payment proof" /></a>}
                  </div>
                  <div className="order-controls">
                    <select value={order.status || "pending"} onChange={(event) => updateOrder(order, { status: event.target.value })}>{["pending", "confirmed", "shipped", "delivered", "cancelled"].map((x) => <option key={x}>{x}</option>)}</select>
                    <select value={order.paymentStatus || "pending"} onChange={(event) => updateOrder(order, { paymentStatus: event.target.value })}>{["cod", "pending", "verified", "rejected", "paid", "unpaid"].map((x) => <option key={x}>{x}</option>)}</select>
                    <input type="number" min="0" defaultValue={order.deliveryDays || ""} onBlur={(event) => updateOrder(order, { deliveryDays: event.target.value })} placeholder="Delivery days" />
                    <textarea defaultValue={order.trackingNote || ""} onBlur={(event) => updateOrder(order, { trackingNote: event.target.value })} placeholder="Tracking note" />
                    {order.estimatedDeliveryDate && <small>Expected: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}</small>}
                  </div>
                </article>
              )) : <p className="admin-empty">No orders yet.</p>}
            </div>
          </AdminPanel>
        )}

        {active === "Settings" && (
          <AdminPanel title="Site settings">
            <form className="admin-form" onSubmit={saveContent}>
              {["brandName", "logoUrl", "faviconUrl", "footerText", "contactEmail", "contactPhone", "contactAddress"].map((field) => (
                ["logoUrl", "faviconUrl"].includes(field)
                  ? <ImageInput key={field} label={field} value={settings[field] || ""} uploading={uploadingField === `settings-${field}`} onChange={(value) => setSettings({ ...settings, [field]: value })} onUpload={(file) => uploadImage(file, `settings-${field}`, (url) => setSettings((current) => ({ ...current, [field]: url })))} />
                  : field === "footerText"
                  ? <textarea key={field} value={settings[field] || ""} onChange={(event) => setSettings({ ...settings, [field]: event.target.value })} placeholder={field} />
                  : <input key={field} value={settings[field] || ""} onChange={(event) => setSettings({ ...settings, [field]: event.target.value })} placeholder={field} />
              ))}
              <button>Save settings</button>
            </form>
          </AdminPanel>
        )}
      </section>
    </main>
  );
}

function AdminPanel({ title, children }) {
  return <div className="admin-panel"><h2>{title}</h2>{children}</div>;
}

function AdminTable({ rows, fields, onEdit, onDelete }) {
  return (
    <div className="admin-table">
      {rows.length ? rows.map((row) => (
        <article key={row.id}>
          {fields.map((field) => field === "image" ? <img className="admin-row-thumb" src={row.image || row.media?.[0] || "/assets/easternwestern-logo.png"} alt="" key={field} /> : <span key={field}>{row[field]}</span>)}
          <button onClick={() => onEdit(row)}>Edit</button>
          <button onClick={() => onDelete(row.id)}>Delete</button>
        </article>
      )) : <p className="admin-empty">No records yet.</p>}
    </div>
  );
}

function EditorNote({ title, text }) {
  return <div className="editor-note"><h3>{title}</h3><p>{text}</p></div>;
}

function StructuredHead({ title, onAdd, addLabel = "Add item" }) {
  return (
    <div className="structured-head">
      <h3>{title}</h3>
      <button type="button" onClick={onAdd}>{addLabel}</button>
    </div>
  );
}

function SlideEditor({ slides, uploadingField, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="structured-editor wide">
      <StructuredHead title="Hero slides" onAdd={onAdd} addLabel="Add slide" />
      {slides.length ? slides.map((slide, index) => (
        <article className="structured-card" key={`slide-${index}`}>
          <input value={slide.label || ""} onChange={(event) => onChange(index, "label", event.target.value)} placeholder="Slide label" />
          <ImageInput label={`Slide ${index + 1} image`} value={slide.image || ""} uploading={uploadingField === `hero-slide-${index}`} onChange={(value) => onChange(index, "image", value)} onUpload={(file) => onUpload(index, file)} />
          <button className="admin-secondary" type="button" onClick={() => onRemove(index)}>Remove</button>
        </article>
      )) : <p className="admin-empty">No slides yet.</p>}
    </div>
  );
}

function CollectionsEditor({ collections, uploadingField, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="structured-editor wide">
      <StructuredHead title="Collections" onAdd={onAdd} addLabel="Add collection" />
      {collections.length ? collections.map((item, index) => (
        <article className="structured-card collection-editor-card" key={`collection-${index}`}>
          {["tag", "name", "title", "price", "oldPrice"].map((field) => <input key={field} value={item[field] || ""} onChange={(event) => onChange(index, field, event.target.value)} placeholder={field} />)}
          <textarea value={item.text || ""} onChange={(event) => onChange(index, "text", event.target.value)} placeholder="text" />
          <ImageInput label={`Collection ${index + 1} image`} value={item.image || ""} uploading={uploadingField === `collection-${index}`} onChange={(value) => onChange(index, "image", value)} onUpload={(file) => onUpload(index, file)} />
          <button className="admin-secondary" type="button" onClick={() => onRemove(index)}>Remove</button>
        </article>
      )) : <p className="admin-empty">No collections yet.</p>}
    </div>
  );
}

function FeatureCardsEditor({ cards, uploadingField, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="structured-editor wide">
      <StructuredHead title="Feature cards" onAdd={onAdd} addLabel="Add feature" />
      {cards.length ? cards.map((card, index) => {
        const tags = Array.isArray(card.tags) ? card.tags : lines(card.tags);
        const updateTag = (tagIndex, value) => onChange(index, "tags", tags.map((tag, i) => i === tagIndex ? value : tag));
        const removeTag = (tagIndex) => onChange(index, "tags", tags.filter((_, i) => i !== tagIndex));
        return (
          <article className="structured-card" key={`feature-${index}`}>
            <input value={card.title || ""} onChange={(event) => onChange(index, "title", event.target.value)} placeholder="title" />
            <textarea value={card.text || ""} onChange={(event) => onChange(index, "text", event.target.value)} placeholder="text" />
            <div className="tag-editor">
              <div className="tag-editor-head"><b>Tags</b><button className="admin-secondary" type="button" onClick={() => onChange(index, "tags", [...tags, ""])}>Add tag</button></div>
              {tags.length ? tags.map((tag, tagIndex) => (
                <div className="tag-row" key={`feature-${index}-tag-${tagIndex}`}>
                  <input value={tag || ""} onChange={(event) => updateTag(tagIndex, event.target.value)} placeholder="Tag name" />
                  <button className="admin-secondary" type="button" onClick={() => removeTag(tagIndex)}>Remove</button>
                </div>
              )) : <p className="admin-empty">No tags yet.</p>}
            </div>
            <ImageInput label={`Feature ${index + 1} image`} value={card.image || ""} uploading={uploadingField === `feature-card-${index}`} onChange={(value) => onChange(index, "image", value)} onUpload={(file) => onUpload(index, file)} />
            <button className="admin-secondary" type="button" onClick={() => onRemove(index)}>Remove feature</button>
          </article>
        );
      }) : <p className="admin-empty">No feature cards yet.</p>}
    </div>
  );
}

function StatCardsEditor({ cards, uploadingField, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="structured-editor wide">
      <StructuredHead title="Stat cards" onAdd={onAdd} addLabel="Add stat" />
      {cards.length ? cards.map((card, index) => (
        <article className="structured-card" key={`stat-${index}`}>
          <input value={card.value || ""} onChange={(event) => onChange(index, "value", event.target.value)} placeholder="value" />
          <input value={card.label || ""} onChange={(event) => onChange(index, "label", event.target.value)} placeholder="label" />
          <ImageInput label={`Stat ${index + 1} image`} value={card.image || ""} uploading={uploadingField === `stat-card-${index}`} onChange={(value) => onChange(index, "image", value)} onUpload={(file) => onUpload(index, file)} />
          <button className="admin-secondary" type="button" onClick={() => onRemove(index)}>Remove</button>
        </article>
      )) : <p className="admin-empty">No stats yet.</p>}
    </div>
  );
}

function ReviewItemsEditor({ items, uploadingField, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="structured-editor wide">
      <StructuredHead title="Review slider" onAdd={onAdd} addLabel="Add review" />
      {items.length ? items.map((item, index) => (
        <article className="structured-card review-editor-card" key={`review-${index}`}>
          <input value={item.rating || ""} onChange={(event) => onChange(index, "rating", event.target.value)} placeholder="rating" />
          <input value={item.summary || ""} onChange={(event) => onChange(index, "summary", event.target.value)} placeholder="summary" />
          <input value={item.name || ""} onChange={(event) => onChange(index, "name", event.target.value)} placeholder="name" />
          <input value={item.role || ""} onChange={(event) => onChange(index, "role", event.target.value)} placeholder="role" />
          <textarea value={item.quote || ""} onChange={(event) => onChange(index, "quote", event.target.value)} placeholder="review text" />
          <ImageInput label={`Reviewer ${index + 1} image`} value={item.image || ""} uploading={uploadingField === `review-item-${index}`} onChange={(value) => onChange(index, "image", value)} onUpload={(file) => onUpload(index, file)} />
          <button className="admin-secondary" type="button" onClick={() => onRemove(index)}>Remove</button>
        </article>
      )) : <p className="admin-empty">No reviews yet.</p>}
    </div>
  );
}

function ImageListEditor({ title, images, uploadingField, onAdd, onRemove, onChange, onUpload }) {
  return (
    <div className="structured-editor wide">
      <StructuredHead title={title} onAdd={onAdd} addLabel="Add image" />
      <div className="image-list-grid">
        {images.length ? images.map((image, index) => (
          <article className="image-list-card" key={`${title}-${index}`}>
            <ImageInput label={`${title} ${index + 1}`} value={image || ""} uploading={uploadingField === `${title.toLowerCase().replace(/\s+/g, "-")}-${index}`} onChange={(value) => onChange(index, value)} onUpload={(file) => onUpload(index, file)} />
            <button className="admin-secondary" type="button" onClick={() => onRemove(index)}>Remove</button>
          </article>
        )) : <p className="admin-empty">No images yet.</p>}
      </div>
    </div>
  );
}

function ImageInput({ label, value, onChange, onUpload, uploading }) {
  return (
    <div className="admin-image-field">
      <div className="image-preview-box">
        {value ? <img src={value} alt="" /> : <span>{label}</span>}
      </div>
      <div className="image-actions">
        <label className="upload-picker">
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = ""; }} />
          {uploading ? "Uploading..." : "Upload"}
        </label>
        {value && <button className="admin-secondary" type="button" onClick={() => onChange("")}>Remove</button>}
      </div>
    </div>
  );
}

function UploadTextarea({ className = "", value, onChange, onUpload, uploading, placeholder }) {
  return (
    <div className={`upload-textarea ${className}`}>
      <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <label className="upload-picker">
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = ""; }} />
        {uploading ? "Uploading..." : "Upload image"}
      </label>
    </div>
  );
}
