import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { defaultBlogs, defaultContent, defaultProducts } from "./defaultData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 5050);
const host = process.env.HOST || "0.0.0.0";
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "easternwestern";
const adminPassword = process.env.ADMIN_PASSWORD;
const adminToken = process.env.ADMIN_TOKEN;
const customerSecret = process.env.CUSTOMER_TOKEN_SECRET || adminToken || "easternwestern-local-customer-secret";
const uploadDir = path.resolve(__dirname, "../public/uploads");
const localStorePath = path.resolve(__dirname, "../data/local-store.json");
let dbPromise;

app.use(express.json({ limit: "16mb" }));

function priceValue(price) {
  return Number(String(price || "").replace(/[^0-9.]/g, "")) || 0;
}

function cleanId(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}

function objectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function uploadExtension(mime, fileName = "") {
  const fromMime = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  }[mime.toLowerCase()];
  if (fromMime) return fromMime;
  const ext = path.extname(fileName).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : "";
}

async function saveImageUpload({ dataUrl, fileName, prefix = "" }) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([a-z0-9+/=]+)$/i);
  if (!match) {
    const error = new Error("Only jpg, png, webp, and gif images are allowed");
    error.status = 400;
    throw error;
  }
  const [, mime, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length) {
    const error = new Error("Empty image");
    error.status = 400;
    throw error;
  }
  if (buffer.length > 8 * 1024 * 1024) {
    const error = new Error("Image must be under 8MB");
    error.status = 413;
    throw error;
  }
  const extension = uploadExtension(mime, fileName);
  if (!extension) {
    const error = new Error("Unsupported image type");
    error.status = 400;
    throw error;
  }
  const rawName = path.parse(String(fileName || "image")).name;
  const safeName = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "image";
  const finalName = `${Date.now()}-${prefix ? `${prefix}-` : ""}${safeName}${extension}`;
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, finalName), buffer);
  return `/uploads/${finalName}`;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash = "") {
  const [salt, hash] = passwordHash.split(":");
  if (!salt || !hash) return false;
  const next = crypto.scryptSync(String(password), salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), next);
}

function encodeToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", customerSecret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function decodeToken(token = "") {
  try {
    const [body, sig] = String(token).split(".");
    if (!body || !sig) return null;
    const expected = crypto.createHmac("sha256", customerSecret).update(body).digest("base64url");
    if (Buffer.byteLength(sig) !== Buffer.byteLength(expected)) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function customerToken(customer) {
  return encodeToken({ id: String(customer.id || customer._id), email: customer.email, iat: Date.now() });
}

function cleanCustomer(customer) {
  if (!customer) return customer;
  const clean = cleanId(customer);
  const { passwordHash, ...rest } = clean;
  return rest;
}

async function customerFromRequest(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const payload = decodeToken(token);
  if (!payload?.id) return null;
  try {
    const db = await getDb();
    const id = objectId(payload.id);
    const query = id ? { _id: id } : { id: payload.id };
    return cleanCustomer(await db.collection("customers").findOne(query));
  } catch {
    const store = await readLocalStore();
    return cleanCustomer(store.customers.find((customer) => customer.id === payload.id || customer.email === payload.email));
  }
}

async function requireCustomer(req, res, next) {
  const customer = await customerFromRequest(req);
  if (!customer) return res.status(401).json({ error: "Customer login required" });
  req.customer = customer;
  next();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeContent(content = {}) {
  return {
    ...clone(defaultContent),
    ...content,
    settings: { ...defaultContent.settings, ...(content.settings || {}) },
    pageHeroes: { ...defaultContent.pageHeroes, ...(content.pageHeroes || {}) },
    sections: { ...defaultContent.sections, ...(content.sections || {}) },
    heroSlides: Array.isArray(content.heroSlides) && content.heroSlides.length ? content.heroSlides : defaultContent.heroSlides,
    reviewItems: Array.isArray(content.reviewItems) && content.reviewItems.length ? content.reviewItems : defaultContent.reviewItems,
    featureCards: Array.isArray(content.featureCards) && content.featureCards.length ? content.featureCards : defaultContent.featureCards,
    statCards: Array.isArray(content.statCards) && content.statCards.length ? content.statCards : defaultContent.statCards,
    avatarImages: Array.isArray(content.avatarImages) && content.avatarImages.length ? content.avatarImages : defaultContent.avatarImages,
    brandImages: Array.isArray(content.brandImages) && content.brandImages.length ? content.brandImages : defaultContent.brandImages,
    collections: Array.isArray(content.collections) && content.collections.length ? content.collections : defaultContent.collections,
    socialImages: Array.isArray(content.socialImages) && content.socialImages.length ? content.socialImages : defaultContent.socialImages,
  };
}

async function readLocalStore() {
  try {
    const store = JSON.parse(await fs.readFile(localStorePath, "utf8"));
    return {
      content: mergeContent(store.content),
      products: Array.isArray(store.products) ? store.products : [],
      blogs: Array.isArray(store.blogs) ? store.blogs : [],
      orders: Array.isArray(store.orders) ? store.orders : [],
      customers: Array.isArray(store.customers) ? store.customers : [],
    };
  } catch {
    return { content: mergeContent(), products: [], blogs: [], orders: [], customers: [] };
  }
}

async function writeLocalStore(store) {
  await fs.mkdir(path.dirname(localStorePath), { recursive: true });
  await fs.writeFile(localStorePath, JSON.stringify(store, null, 2));
}

function localId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function getDb() {
  if (!mongoUri) throw new Error("MONGODB_URI missing");
  if (!dbPromise) {
    const client = new MongoClient(mongoUri);
    dbPromise = client.connect().then(() => client.db(dbName));
  }
  return dbPromise;
}

async function removeLegacyDemoCatalog(db) {
  const flags = db.collection("systemFlags");
  if (await flags.findOne({ key: "removedDemoListings" })) return;
  const productSlugs = defaultProducts.map((product) => product.slug).filter(Boolean);
  const blogSlugs = defaultBlogs.map((blog) => blog.slug).filter(Boolean);
  await Promise.all([
    productSlugs.length ? db.collection("products").deleteMany({ slug: { $in: productSlugs } }) : Promise.resolve(),
    blogSlugs.length ? db.collection("blogs").deleteMany({ slug: { $in: blogSlugs } }) : Promise.resolve(),
  ]);
  await flags.updateOne(
    { key: "removedDemoListings" },
    { $set: { key: "removedDemoListings", completedAt: new Date(), updatedAt: new Date() } },
    { upsert: true }
  );
}

async function ensureContent(db) {
  const content = db.collection("siteContent");
  const existing = await content.findOne({ key: "main" });
  if (!existing) {
    await content.insertOne({ ...defaultContent, updatedAt: new Date() });
  } else {
    await content.updateOne({ key: "main" }, {
      $set: {
        settings: { ...defaultContent.settings, ...(existing.settings || {}) },
        pageHeroes: { ...defaultContent.pageHeroes, ...(existing.pageHeroes || {}) },
        sections: { ...defaultContent.sections, ...(existing.sections || {}) },
        heroSlides: Array.isArray(existing.heroSlides) && existing.heroSlides.length ? existing.heroSlides : defaultContent.heroSlides,
        reviewItems: Array.isArray(existing.reviewItems) && existing.reviewItems.length ? existing.reviewItems : defaultContent.reviewItems,
        featureCards: Array.isArray(existing.featureCards) && existing.featureCards.length ? existing.featureCards : defaultContent.featureCards,
        statCards: Array.isArray(existing.statCards) && existing.statCards.length ? existing.statCards : defaultContent.statCards,
        avatarImages: Array.isArray(existing.avatarImages) && existing.avatarImages.length ? existing.avatarImages : defaultContent.avatarImages,
        brandImages: Array.isArray(existing.brandImages) && existing.brandImages.length ? existing.brandImages : defaultContent.brandImages,
        collections: Array.isArray(existing.collections) && existing.collections.length ? existing.collections : defaultContent.collections,
        socialImages: Array.isArray(existing.socialImages) && existing.socialImages.length ? existing.socialImages : defaultContent.socialImages,
        updatedAt: existing.updatedAt || new Date(),
      },
    });
  }
  await removeLegacyDemoCatalog(db);
}

async function getPublicData() {
  try {
    const db = await getDb();
    await ensureContent(db);
    const [content, products, blogs] = await Promise.all([
      db.collection("siteContent").findOne({ key: "main" }),
      db.collection("products").find({ status: "published" }).sort({ sortOrder: 1, createdAt: 1 }).toArray(),
      db.collection("blogs").find({ status: "published" }).sort({ sortOrder: 1, createdAt: 1 }).toArray(),
    ]);
    return { content: cleanId(content), products: products.map(cleanId), blogs: blogs.map(cleanId), usingMongo: true };
  } catch (error) {
    const store = await readLocalStore();
    return {
      content: store.content,
      products: store.products.filter((product) => product.status === "published"),
      blogs: store.blogs.filter((blog) => blog.status === "published"),
      usingMongo: false,
      error: error.message,
    };
  }
}

function requireAdmin(req, res, next) {
  if (!adminToken) return res.status(503).json({ error: "Admin token is not configured" });
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "") || req.headers["x-admin-token"];
  if (token !== adminToken) return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.get("/api/health", async (_req, res) => {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    res.json({ ok: true, mongo: true });
  } catch (error) {
    res.status(503).json({ ok: false, mongo: false, error: error.message });
  }
});

app.get("/api/public-data", async (_req, res) => {
  res.json(await getPublicData());
});

app.post("/api/uploads/payment-proof", async (req, res) => {
  try {
    const url = await saveImageUpload({ dataUrl: req.body.dataUrl, fileName: req.body.fileName, prefix: "proof" });
    res.status(201).json({ url });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.post("/api/customers/register", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const name = String(req.body.name || "").trim();
  const phone = String(req.body.phone || "").trim();
  const password = String(req.body.password || "");
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password required" });
  const customer = { name, email, phone, passwordHash: hashPassword(password), createdAt: new Date(), updatedAt: new Date() };
  try {
    const db = await getDb();
    const exists = await db.collection("customers").findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });
    const result = await db.collection("customers").insertOne(customer);
    const saved = cleanCustomer({ _id: result.insertedId, ...customer });
    res.status(201).json({ customer: saved, token: customerToken(saved) });
  } catch (error) {
    const store = await readLocalStore();
    if (store.customers.some((item) => item.email === email)) return res.status(409).json({ error: "Email already registered" });
    const saved = { id: localId(), ...customer };
    store.customers.push(saved);
    await writeLocalStore(store);
    res.status(201).json({ customer: cleanCustomer(saved), token: customerToken(saved), usingMongo: false, error: error.message });
  }
});

app.post("/api/customers/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  try {
    const db = await getDb();
    const customer = await db.collection("customers").findOne({ email });
    if (!customer || !verifyPassword(password, customer.passwordHash)) return res.status(401).json({ error: "Wrong email or password" });
    const clean = cleanCustomer(customer);
    res.json({ customer: clean, token: customerToken(clean) });
  } catch (error) {
    const store = await readLocalStore();
    const customer = store.customers.find((item) => item.email === email);
    if (!customer || !verifyPassword(password, customer.passwordHash)) return res.status(401).json({ error: "Wrong email or password" });
    const clean = cleanCustomer(customer);
    res.json({ customer: clean, token: customerToken(clean), usingMongo: false, error: error.message });
  }
});

app.get("/api/customer/me", requireCustomer, (req, res) => {
  res.json({ customer: req.customer });
});

app.get("/api/customer/orders", requireCustomer, async (req, res) => {
  try {
    const db = await getDb();
    const orders = await db.collection("orders").find({ $or: [{ customerId: req.customer.id }, { "customer.email": req.customer.email }] }).sort({ createdAt: -1 }).toArray();
    res.json({ orders: orders.map(cleanId) });
  } catch (error) {
    const store = await readLocalStore();
    const orders = store.orders.filter((order) => order.customerId === req.customer.id || order.customer?.email === req.customer.email);
    res.json({ orders, usingMongo: false, error: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ error: "Cart is empty" });
  const account = await customerFromRequest(req);
  const customer = {
    name: String(req.body.customer?.name || account?.name || "").trim(),
    email: String(req.body.customer?.email || account?.email || "").trim().toLowerCase(),
    phone: String(req.body.customer?.phone || account?.phone || "").trim(),
    address: String(req.body.customer?.address || "").trim(),
  };
  if (!customer.name || !customer.email || !customer.phone || !customer.address) return res.status(400).json({ error: "Customer details required" });
  const paymentMethod = String(req.body.paymentMethod || "Cash on Delivery").trim();
  const paymentProofUrl = String(req.body.paymentProofUrl || "").trim();
  if (paymentMethod !== "Cash on Delivery" && !paymentProofUrl) return res.status(400).json({ error: "Payment proof required" });
  const orderItems = items.map((item) => ({ slug: item.slug, name: item.name, image: item.image, price: item.price, qty: Math.max(1, Number(item.qty) || 1) }));
  const subtotal = orderItems.reduce((sum, item) => sum + priceValue(item.price) * item.qty, 0);
  const order = {
    orderNo: `EW-${Date.now()}`,
    customerId: account?.id || "",
    customer,
    items: orderItems,
    subtotal,
    status: "pending",
    paymentMethod,
    paymentStatus: paymentMethod === "Cash on Delivery" ? "cod" : "pending",
    paymentProofUrl,
    deliveryDays: "",
    estimatedDeliveryDate: "",
    trackingNote: "",
    notes: String(req.body.notes || ""),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    const db = await getDb();
    await ensureContent(db);
    const result = await db.collection("orders").insertOne(order);
    res.status(201).json({ order: cleanId({ _id: result.insertedId, ...order }) });
  } catch (error) {
    const store = await readLocalStore();
    const localOrder = { id: localId(), ...order };
    store.orders.unshift(localOrder);
    await writeLocalStore(store);
    res.status(201).json({ order: localOrder, usingMongo: false, error: error.message });
  }
});

app.post("/api/admin/login", (req, res) => {
  if (!adminPassword || !adminToken) return res.status(503).json({ error: "Admin credentials are not configured" });
  if (req.body.password !== adminPassword) return res.status(401).json({ error: "Wrong password" });
  res.json({ token: adminToken });
});

app.post("/api/admin/uploads", requireAdmin, async (req, res) => {
  try {
    const url = await saveImageUpload({ dataUrl: req.body.dataUrl, fileName: req.body.fileName });
    res.status(201).json({ url });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.get("/api/admin/dashboard", requireAdmin, async (_req, res) => {
  try {
    const db = await getDb();
    await ensureContent(db);
    const [content, products, blogs, orders] = await Promise.all([
      db.collection("siteContent").findOne({ key: "main" }),
      db.collection("products").find().sort({ sortOrder: 1, createdAt: 1 }).toArray(),
      db.collection("blogs").find().sort({ sortOrder: 1, createdAt: 1 }).toArray(),
      db.collection("orders").find().sort({ createdAt: -1 }).toArray(),
    ]);
    res.json({ content: cleanId(content), products: products.map(cleanId), blogs: blogs.map(cleanId), orders: orders.map(cleanId) });
  } catch (error) {
    const store = await readLocalStore();
    res.json({ ...store, usingMongo: false, error: error.message });
  }
});

app.put("/api/admin/content", requireAdmin, async (req, res) => {
  const next = { ...req.body, key: "main", updatedAt: new Date() };
  try {
    const db = await getDb();
    await db.collection("siteContent").updateOne({ key: "main" }, { $set: next }, { upsert: true });
    res.json({ content: cleanId(await db.collection("siteContent").findOne({ key: "main" })) });
  } catch (error) {
    const store = await readLocalStore();
    store.content = mergeContent(next);
    await writeLocalStore(store);
    res.json({ content: store.content, usingMongo: false, error: error.message });
  }
});

function cleanStringArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function cleanVariants(value) {
  if (!Array.isArray(value)) return [];
  return value.map((variant) => ({
    size: String(variant.size || "").trim(),
    color: String(variant.color || "").trim(),
    material: String(variant.material || "").trim(),
    sku: String(variant.sku || "").trim(),
    price: String(variant.price || "").trim(),
    stock: Number(variant.stock) || 0,
    image: String(variant.image || "").trim(),
  })).filter((variant) => variant.size || variant.color || variant.sku || variant.material);
}

function productPayload(body) {
  const media = cleanStringArray(body.media || body.images);
  const image = body.image || media[0] || "";
  const hoverImage = body.hoverImage || media[1] || image;
  const compareAtPrice = body.compareAtPrice || body.oldPrice || "";
  return {
    tag: body.tag || "New",
    name: body.name || "Untitled product",
    slug: body.slug || String(body.name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    category: body.category || "UNSTITCHED NEW IN",
    sku: String(body.sku || "").trim(),
    price: body.price || "$0.00",
    compareAtPrice,
    oldPrice: compareAtPrice,
    image,
    hoverImage,
    media: media.length ? media : [image, hoverImage].filter(Boolean),
    tags: cleanStringArray(body.tags),
    variants: cleanVariants(body.variants),
    description: body.description || "",
    stock: Number(body.stock) || 0,
    status: body.status || "published",
    featured: Boolean(body.featured),
    sortOrder: Number(body.sortOrder) || 0,
    updatedAt: new Date(),
  };
}

app.post("/api/admin/products", requireAdmin, async (req, res) => {
  const product = { ...productPayload(req.body), createdAt: new Date() };
  try {
    const db = await getDb();
    const result = await db.collection("products").insertOne(product);
    res.status(201).json({ product: cleanId({ _id: result.insertedId, ...product }) });
  } catch (error) {
    const store = await readLocalStore();
    const localProduct = { id: localId(), ...product };
    store.products.push(localProduct);
    await writeLocalStore(store);
    res.status(201).json({ product: localProduct, usingMongo: false, error: error.message });
  }
});

app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const id = objectId(req.params.id);
  const next = productPayload(req.body);
  try {
    if (!id) throw new Error("Local id");
    const db = await getDb();
    await db.collection("products").updateOne({ _id: id }, { $set: next });
    res.json({ product: cleanId(await db.collection("products").findOne({ _id: id })) });
  } catch (error) {
    const store = await readLocalStore();
    store.products = store.products.map((product) => product.id === req.params.id ? { ...product, ...next } : product);
    await writeLocalStore(store);
    res.json({ product: store.products.find((product) => product.id === req.params.id), usingMongo: false, error: error.message });
  }
});

app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const id = objectId(req.params.id);
  try {
    if (!id) throw new Error("Local id");
    const db = await getDb();
    await db.collection("products").deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (error) {
    const store = await readLocalStore();
    store.products = store.products.filter((product) => product.id !== req.params.id);
    await writeLocalStore(store);
    res.json({ ok: true, usingMongo: false, error: error.message });
  }
});

function blogPayload(body) {
  return {
    category: body.category || "Style Guide",
    title: body.title || "Untitled post",
    slug: body.slug || String(body.title || "post").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    excerpt: body.excerpt || "",
    readTime: body.readTime || "5 min read",
    date: body.date || new Date().toLocaleDateString("en-US"),
    image: body.image || "/assets/38.jpg",
    body: body.body || "",
    status: body.status || "published",
    sortOrder: Number(body.sortOrder) || 0,
    updatedAt: new Date(),
  };
}

app.post("/api/admin/blogs", requireAdmin, async (req, res) => {
  const blog = { ...blogPayload(req.body), createdAt: new Date() };
  try {
    const db = await getDb();
    const result = await db.collection("blogs").insertOne(blog);
    res.status(201).json({ blog: cleanId({ _id: result.insertedId, ...blog }) });
  } catch (error) {
    const store = await readLocalStore();
    const localBlog = { id: localId(), ...blog };
    store.blogs.push(localBlog);
    await writeLocalStore(store);
    res.status(201).json({ blog: localBlog, usingMongo: false, error: error.message });
  }
});

app.put("/api/admin/blogs/:id", requireAdmin, async (req, res) => {
  const id = objectId(req.params.id);
  const next = blogPayload(req.body);
  try {
    if (!id) throw new Error("Local id");
    const db = await getDb();
    await db.collection("blogs").updateOne({ _id: id }, { $set: next });
    res.json({ blog: cleanId(await db.collection("blogs").findOne({ _id: id })) });
  } catch (error) {
    const store = await readLocalStore();
    store.blogs = store.blogs.map((blog) => blog.id === req.params.id ? { ...blog, ...next } : blog);
    await writeLocalStore(store);
    res.json({ blog: store.blogs.find((blog) => blog.id === req.params.id), usingMongo: false, error: error.message });
  }
});

app.delete("/api/admin/blogs/:id", requireAdmin, async (req, res) => {
  const id = objectId(req.params.id);
  try {
    if (!id) throw new Error("Local id");
    const db = await getDb();
    await db.collection("blogs").deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (error) {
    const store = await readLocalStore();
    store.blogs = store.blogs.filter((blog) => blog.id !== req.params.id);
    await writeLocalStore(store);
    res.json({ ok: true, usingMongo: false, error: error.message });
  }
});

app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
  const id = objectId(req.params.id);
  const next = { updatedAt: new Date() };
  if (req.body.status) next.status = req.body.status;
  if (req.body.paymentStatus) next.paymentStatus = req.body.paymentStatus;
  if (req.body.deliveryDays !== undefined) {
    next.deliveryDays = String(req.body.deliveryDays || "").trim();
    const days = Number(next.deliveryDays);
    if (days > 0) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      next.estimatedDeliveryDate = date.toISOString();
    } else {
      next.estimatedDeliveryDate = "";
    }
  }
  if (req.body.trackingNote !== undefined) next.trackingNote = String(req.body.trackingNote || "").trim();
  try {
    if (!id) throw new Error("Local id");
    const db = await getDb();
    await db.collection("orders").updateOne({ _id: id }, { $set: next });
    res.json({ order: cleanId(await db.collection("orders").findOne({ _id: id })) });
  } catch (error) {
    const store = await readLocalStore();
    store.orders = store.orders.map((order) => order.id === req.params.id ? { ...order, ...next } : order);
    await writeLocalStore(store);
    res.json({ order: store.orders.find((order) => order.id === req.params.id), usingMongo: false, error: error.message });
  }
});

const distPath = path.resolve(__dirname, "../dist");
app.use("/uploads", express.static(uploadDir));
app.use(express.static(distPath));
app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, "index.html")));

app.listen(port, host, () => {
  console.log(`EasternWestern API running on http://${host}:${port}`);
});
