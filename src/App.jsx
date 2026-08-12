import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import "./index.css";

const logo = "/assets/easternwestern-logo.png";
const hero = "/assets/02.jpg";

const heroSlides = [
  ["Urban", "/assets/93.jpg"],
  ["Latest", "/assets/03.jpg"],
  ["Premium", "/assets/04.jpg"],
  ["Arctic", "/assets/02.jpg"],
  ["Casual", "/assets/94.png"],
  ["Iconic", "/assets/95.png"],
  ["Unique", "/assets/96.jpg"],
];

const arrivals = [
  ["New", "Textured Knitted Shirt", "textured-knitted-shirt", "$59.00", "$79.00", "/assets/06.jpg", "/assets/05.jpg", "Soft textured knitwear shaped for easy daily layering."],
  ["New", "Structured Trench Coat", "structured-trench-coat", "$210.00", "$280.00", "/assets/08.jpg", "/assets/07.jpg", "A clean trench silhouette with a refined weather-ready profile."],
  ["New", "Mini Denim Overalls", "mini-denim-overalls", "$45.00", "$60.00", "/assets/10.jpg", "/assets/09.jpg", "Relaxed denim overalls built for simple everyday styling."],
  ["New", "Riviera Collar Shirt", "riviera-collar-shirt", "$45.00", "$60.00", "/assets/12.jpg", "/assets/11.jpg", "A light open-collar shirt with a soft resort-inspired drape."],
  ["New", "Stretch Jersey Tee", "stretch-jersey-tee", "$65.00", "$95.00", "/assets/14.jpg", "/assets/13.jpg", "A premium tee with stretch comfort and a polished daily fit."],
  ["New", "Urban Utility Cargo", "urban-utility-cargo", "$90.00", "$120.00", "/assets/16.png", "/assets/15.png", "Utility cargo styling with a structured urban shape."],
  ["New", "Classic Boxy Tee", "classic-boxy-tee", "$35.00", "$45.00", "/assets/18.jpg", "/assets/17.jpg", "A relaxed boxy essential made for repeated daily wear."],
  ["New", "Pleated Smart Trousers", "pleated-smart-trousers", "$76.00", "$100.00", "/assets/20.png", "/assets/19.webp", "Clean pleated trousers balancing comfort and sharp styling."],
  ["New", "French Terry Shorts", "french-terry-shorts", "$40.00", "$55.00", "/assets/22.jpg", "/assets/21.webp", "Soft terry shorts cut for warm days and easy movement."],
];

const sellers = [
  ["Best seller", "Heavyweight Oversized Hoodie", "heavyweight-oversized-hoodie", "$85.00", "$110.00", "/assets/24.jpg", "/assets/23.jpg", "A heavyweight hoodie with a relaxed oversized profile."],
  ["Best seller", "Patterned Knit Sweater", "patterned-knit-sweater", "$45.00", "$90.00", "/assets/26.png", "/assets/25.png", "A patterned knit piece with soft texture and easy warmth."],
  ["Best seller", "Quilted Bomber Jacket", "quilted-bomber-jacket", "$145.00", "$180.00", "/assets/28.jpg", "/assets/27.webp", "A quilted bomber designed for polished cold-weather layering."],
  ["Best seller", "Hooded Puffer Vest", "hooded-puffer-vest", "$45.00", "$75.00", "/assets/30.png", "/assets/29.png", "A light puffer vest for flexible seasonal styling."],
  ["Best seller", "Vegan Leather Leggings", "vegan-leather-leggings", "$75.00", "$99.00", "/assets/32.jpg", "/assets/31.jpg", "Sleek vegan leather leggings with a modern fitted look."],
  ["Best seller", "Cropped Boxy Blazer", "cropped-boxy-blazer", "$130.00", "$175.00", "/assets/34.jpg", "/assets/33.jpg", "A cropped blazer with a structured, boxy modern silhouette."],
];

const extras = [
  ["New", "Relaxed Tapered Chinos", "relaxed-tapered-chinos", "$65.00", "$80.00", "/assets/128.jpg", "/assets/127.jpg", "Relaxed tapered chinos with a soft structured profile."],
  ["New", "V-Neck Satin Cami", "v-neck-satin-cami", "$65.00", "$90.00", "/assets/130.png", "/assets/129.png", "A smooth satin cami with a clean V-neck silhouette."],
  ["New", "Ribbed Knit Midi", "ribbed-knit-midi", "$95.00", "$125.00", "/assets/132.png", "/assets/131.jpg", "A ribbed midi dress shaped for simple polished wear."],
  ["New", "High Waisted Palazzo", "high-waisted-palazzo", "$85.00", "$110.00", "/assets/134.png", "/assets/133.png", "High waisted palazzo trousers with an easy flowing line."],
  ["New", "Silk Slip Dress", "silk-slip-dress", "$120.00", "$160.00", "/assets/136.png", "/assets/135.jpg", "A refined silk slip dress with a soft minimalist finish."],
];

const shopProducts = [
  arrivals[0], arrivals[1], sellers[0], arrivals[2], arrivals[3], sellers[1],
  arrivals[4], arrivals[5], arrivals[6], sellers[2], arrivals[7], arrivals[8],
  extras[0], sellers[3], extras[1], sellers[4], extras[2], sellers[5], extras[3], extras[4],
];

const allProducts = shopProducts;

const fallbackSiteData = {
  content: {
    settings: {
      heroKicker: "Soft",
      heroCompanion: "Warm Winter Layers",
      heroTitle: "Premium wear\nfor modern living",
      heroText: "Discover our new range of soft clothes made for your daily look and your best days with the finest fabrics.",
      offerEnabled: true,
      offerText: "Black friday sale 50% off",
      brandName: "EasternWestern",
      logoUrl: "/assets/easternwestern-logo.png",
      faviconUrl: "/favicon.png",
      footerText: "A sophisticated e-commerce template designed for modern and minimalist brands.",
      contactEmail: "test@gmail.com",
      contactPhone: "+001 234 567 890",
      contactAddress: "England, London",
    },
    pageHeroes: {
      about: { kicker: "About", companion: "Know about EasternWestern", title: "Timeless design, modern wearability", text: "We focus on creating essential garments that remain relevant, functional, and refined across seasons.", image: "/assets/53.png" },
      shop: { kicker: "Shop", companion: "The new season", title: "Elevate your daily wardrobe with ease", text: "Explore handpicked modern silhouettes crafted from premium fabrics.", image: "/assets/126.png" },
      blog: { kicker: "Blog", companion: "Read our stories", title: "The craft behind every single stitch", text: "Discover the detailed process of creating premium garments and timeless styling.", image: "/assets/81.jpeg" },
      contact: { kicker: "Contact", companion: "Here to help you", title: "Helping you define your personal style", text: "Contact us today for refined service designed for the EasternWestern community.", image: "/assets/88.png" },
    },
    sections: {
      about: { logo: "/assets/easternwestern-logo.png", poster: "/assets/story-poster.png", year: "Since 2014", title: "Defining modern style", text: "A decade ago, we set out to redefine the modern silhouette. Today, we merge urban utility with high-end aesthetics in a resilient, beautiful collection." },
      aboutTrust: { rating: "4.9/5 rating", text: "Trusted by 1k+ businesses" },
      aboutStats: { kicker: "About EasternWestern", title: "More than fashion, EasternWestern is a commitment to intentional design. Our curated collections focus on sleek silhouettes, empowering your unique and personal journey with modern ease." },
      review: { kicker: "Customer reviews", title: "The voice of quality", text: "Experience the difference through the words of customers who value premium fabrics and timeless design.", rating: "5.0/5", summary: "4.9 from 1k+ reviews", quote: "The premium quality of the men's collection is truly unmatched lately. The fabrics feel incredibly premium and soft. This specific tailored fit is perfect for my busy office. A very sharp look. I love it every day.", name: "James Carter", role: "Creative Director", image: "/assets/51.png" },
      features: { kicker: "What defines our wear", title: "Where style meets ease", text: "Thoughtful design blending modern style, comfort, and versatility for everyday living across lifestyles." },
      blogList: { kicker: "EasternWestern Voice", title: "Elevating your daily style journey" },
      contactInfo: { emailIcon: "/assets/89.svg", phoneIcon: "/assets/90.svg", addressIcon: "/assets/91.svg", image: "/assets/92.png" },
      social: { kicker: "Stay connected", title: "See our community\nin modern silhouettes", text: "Connect with us on social media for a daily dose of fresh style, featuring exclusive looks from our community." },
    },
    heroSlides: heroSlides.map(([label, image]) => ({ label, image })),
    reviewItems: [
      { rating: "5.0/5", summary: "4.9 from 1k+ reviews", quote: "The premium quality of the men's collection is truly unmatched lately. The fabrics feel incredibly premium and soft. This specific tailored fit is perfect for my busy office. A very sharp look. I love it every day.", name: "James Carter", role: "Creative Director", image: "/assets/51.png" },
      { rating: "4.9/5", summary: "Loved by daily customers", quote: "EasternWestern pieces feel polished without being difficult to wear. The fabric, fit, and clean styling make every outfit feel intentional.", name: "Ayesha Khan", role: "Fashion Stylist", image: "/assets/54.png" },
      { rating: "5.0/5", summary: "Premium comfort", quote: "The collection looks minimal but feels very premium in hand. I ordered two pieces and both became my regular weekly essentials.", name: "Michael Lee", role: "Creative Lead", image: "/assets/55.png" },
    ],
    featureCards: [
      { title: "Everyday Comfort", text: "Designed to feel natural on the body throughout long, active days.", tags: ["All-day wear", "Comfort", "Relaxed fit"], image: "/assets/43.png" },
      { title: "Modern Silhouettes", text: "Contemporary shapes balance structure and ease for confident everyday styling.", tags: ["Balanced fit", "Modern", "Structured"], image: "/assets/44.jpeg" },
      { title: "Effortless Styling", text: "Pieces work together naturally, making daily outfit choices simple and intuitive.", tags: ["Versatile", "Easy to style", "Layered"], image: "/assets/45.jpeg" },
      { title: "Daily Essentials", text: "Core clothing pieces designed for frequent wear across modern everyday routines.", tags: ["Core pieces", "Everyday", "Wearable"], image: "/assets/46.jpeg" },
      { title: "Wearable Design", text: "Design decisions focused on comfort, fit, and real-life wearability.", tags: ["Practical", "Functional", "Adaptable"], image: "/assets/47.jpeg" },
      { title: "Clean Aesthetic", text: "Designed to feel natural on the body throughout long, active days.", tags: ["Clean lines", "Minimal", "Timeless"], image: "/assets/48.jpeg" },
    ],
    statCards: [
      { value: "10M+", label: "Pieces worn daily", image: "/assets/64.png" },
      { value: "98%", label: "Customer Satisfaction", image: "/assets/65.jpeg" },
      { value: "300+", label: "Essential Styles", image: "/assets/66.jpeg" },
      { value: "500K+", label: "Community worldwide", image: "/assets/67.png" },
    ],
    avatarImages: ["/assets/54.png", "/assets/55.png", "/assets/56.png", "/assets/57.png", "/assets/58.png"],
    brandImages: ["/assets/59.svg", "/assets/60.svg", "/assets/61.svg", "/assets/62.svg", "/assets/63.svg", "/assets/59.svg", "/assets/63.svg", "/assets/61.svg"],
    collections: [
      { tag: "New", name: "Mens's wear", title: "Premium modern collection for men", text: "Upgrade your daily look with crafted pieces made from refined fabrics.", price: "$45.00", oldPrice: "$180.00", image: "/assets/35.png" },
      { tag: "New", name: "Women's wear", title: "Modern daily wear for women", text: "Elevate your daily style with soft pieces designed for fresh everyday looks.", price: "$35.00", oldPrice: "$150.00", image: "/assets/36.png" },
      { tag: "2026", name: "Children's wear", title: "Modern easy styles for children", text: "Soft-touch clothing made for play, comfort, and long-lasting wear.", price: "$25.00", oldPrice: "$90.00", image: "/assets/37.png" },
    ],
    socialImages: ["/assets/72.png", "/assets/68.png", "/assets/69.jpg", "/assets/70.png", "/assets/71.png", "/assets/72.png", "/assets/73.png", "/assets/74.png", "/assets/72.png"],
  },
  products: [],
  blogs: [],
};

function productDocToItem(product) {
  const media = Array.isArray(product.media) ? product.media.filter(Boolean) : [];
  const image = product.image || media[0] || "";
  const hoverImage = product.hoverImage || media[1] || image;
  const item = [
    product.tag || "New",
    product.name || "Untitled product",
    product.slug || "product",
    product.price || "$0.00",
    product.oldPrice || product.compareAtPrice || "",
    image,
    hoverImage,
    product.description || "",
  ];
  item.id = product.id;
  item.category = product.category;
  item.sku = product.sku;
  item.stock = product.stock;
  item.status = product.status;
  item.media = media.length ? media : [image, hoverImage].filter(Boolean);
  item.tags = product.tags || [];
  item.variants = product.variants || [];
  item.featured = product.featured;
  return item;
}

function blogDocToItem(blog) {
  return [
    blog.category || "Style Guide",
    blog.title || "Untitled post",
    blog.slug || "post",
    blog.excerpt || "",
    blog.readTime || "5 min read",
    blog.date || "",
    blog.image || "/assets/38.jpg",
    blog.body || "",
  ];
}

function normalizeSiteData(payload = {}) {
  const products = Array.isArray(payload.products) ? payload.products.map(productDocToItem) : [];
  const liveBlogs = Array.isArray(payload.blogs) ? payload.blogs.map(blogDocToItem) : [];
  const content = payload.content || fallbackSiteData.content;
  return {
    content: {
      ...fallbackSiteData.content,
      ...content,
      settings: { ...fallbackSiteData.content.settings, ...(content.settings || {}) },
      pageHeroes: { ...fallbackSiteData.content.pageHeroes, ...(content.pageHeroes || {}) },
      sections: { ...fallbackSiteData.content.sections, ...(content.sections || {}) },
      heroSlides: Array.isArray(content.heroSlides) && content.heroSlides.length ? content.heroSlides : fallbackSiteData.content.heroSlides,
      featureCards: Array.isArray(content.featureCards) && content.featureCards.length ? content.featureCards : fallbackSiteData.content.featureCards,
      reviewItems: Array.isArray(content.reviewItems) && content.reviewItems.length ? content.reviewItems : fallbackSiteData.content.reviewItems,
      statCards: Array.isArray(content.statCards) && content.statCards.length ? content.statCards : fallbackSiteData.content.statCards,
      avatarImages: Array.isArray(content.avatarImages) && content.avatarImages.length ? content.avatarImages : fallbackSiteData.content.avatarImages,
      brandImages: Array.isArray(content.brandImages) && content.brandImages.length ? content.brandImages : fallbackSiteData.content.brandImages,
      collections: Array.isArray(content.collections) && content.collections.length ? content.collections : fallbackSiteData.content.collections,
      socialImages: Array.isArray(content.socialImages) && content.socialImages.length ? content.socialImages : fallbackSiteData.content.socialImages,
    },
    products,
    blogs: liveBlogs,
  };
}

function categoryForProduct(item, index) {
  if (item.category) return item.category;
  if ([3, 5, 13].includes(index)) return "Children's Wear";
  if (index >= 14) return "Women's Wear";
  return "Men's Wear";
}

const collections = [
  ["New", "Mens's wear", "Premium modern collection for men", "Upgrade your daily look with our crafted pieces made from the finest fabrics for lasting comfort and timeless style.", "$45.00", "$180.00", "/assets/35.png"],
  ["New", "Women's wear", "Modern daily wear for women", "Elevate your style with our signature soft pieces designed to make every single day feel truly fresh and special.", "$35.00", "$150.00", "/assets/36.png"],
  ["2026", "Children's wear", "Modern easy styles for children", "Provide your children with the best soft touch gear made for play and long lasting wear throughout every single busy day.", "$25.00", "$90.00", "/assets/37.png"],
];

const features = [
  ["Everyday Comfort", "Designed to feel natural on the body throughout long, active days.", ["All-day wear", "Comfort", "Relaxed fit"]],
  ["Modern Silhouettes", "Contemporary shapes balance structure and ease for confident everyday styling.", ["Balanced fit", "Modern", "Structured"]],
  ["Effortless Styling", "Pieces work together naturally, making daily outfit choices simple and intuitive.", ["Versatile", "Easy to style", "Layered"]],
  ["Daily Essentials", "Core clothing pieces designed for frequent wear across modern everyday routines.", ["Core pieces", "Everyday", "Wearable"]],
  ["Wearable Design", "Design decisions focused on comfort, fit, and real-life wearability.", ["Practical", "Functional", "Adaptable"]],
  ["Clean Aesthetic", "Designed to feel natural on the body throughout long, active days.", ["Clean lines", "Minimal", "Timeless"]],
];

const blogs = [
  ["Style Guide", "How to master the art of minimal street style", "how-to-master-the-art-of-minimal-street-style", "Build a timeless, comfortable wardrobe with high-quality fabrics, muted tones, and effortless oversized fits.", "8 min read", "Jan 29, 2026", "/assets/38.jpg"],
  ["Fashion Tips", "Elevate everyday outfits using modern minimalist styling", "elevate-everyday-outfits-using-modern-minimalist-styling", "A simple approach to shaping daily outfits with clean silhouettes and balanced layers.", "8 min read", "12/30/25", "/assets/39.png"],
  ["Style Guide", "Build a capsule wardrobe that works year round", "build-a-capsule-wardrobe-that-works-year-round", "Select versatile pieces that work across seasons without losing comfort or polish.", "5 min read", "11/22/25", "/assets/40.png"],
  ["Fashion Tips", "Refine casual streetwear with thoughtful styling choices", "refine-casual-streetwear-with-thoughtful-styling-choices", "Use relaxed layers, soft neutrals, and proportion to keep casual outfits intentional.", "8 min read", "10/12/25", "/assets/82.png"],
  ["Style Guide", "Style outfits confidently using seasonal color palettes", "style-outfits-confidently-using-seasonal-color-palettes", "Build color confidence by grounding seasonal tones with timeless everyday basics.", "9 min read", "10/24/25", "/assets/83.png"],
  ["Style Guide", "Discover timeless essentials that shape modern wardrobes", "discover-timeless-essentials-that-shape-modern-wardrobes", "Essential garments make daily style faster, sharper, and easier to repeat.", "8 min read", "12/21/25", "/assets/84.png"],
  ["Brand Stories", "Build a strong fashion identity through consistency", "build-a-strong-fashion-identity-through-consistency", "Consistent silhouettes and material choices help a brand feel recognizable.", "6 min read", "10/16/24", "/assets/85.png"],
  ["Brand Stories", "Design intentional outfits that feel effortless daily", "design-intentional-outfits-that-feel-effortless-daily", "Intentional dressing starts with pieces that feel natural and useful every day.", "7 min read", "12/24/25", "/assets/86.jpeg"],
  ["Fashion Tips", "Use texture to elevate everyday outfit styling", "use-texture-to-elevate-everyday-outfit-styling", "Texture adds depth to simple outfits without needing loud color or heavy accessories.", "5 min read", "10/24/25", "/assets/87.png"],
];

const socials = ["/assets/41.jpeg", "/assets/42.jpeg", "/assets/43.png", "/assets/44.jpeg", "/assets/45.jpeg", "/assets/46.jpeg", "/assets/47.jpeg", "/assets/48.jpeg", "/assets/49.jpg", "/assets/50.png"];
const routeSocials = ["/assets/72.png", "/assets/68.png", "/assets/69.jpg", "/assets/70.png", "/assets/71.png", "/assets/72.png", "/assets/73.png", "/assets/74.png", "/assets/72.png"];
const statCards = [
  ["10M+", "Pieces worn daily", "/assets/64.png"],
  ["98%", "Customer Satisfaction", "/assets/65.jpeg"],
  ["300+", "Essential Styles", "/assets/66.jpeg"],
  ["500K+", "Community worldwide", "/assets/67.png"],
];

function slugPath(type, slug) {
  return `/${type}/${slug}`;
}

function cartProduct(item) {
  const [tag, name, slug, price, old, image] = item;
  return { tag, name, slug, price, old, image };
}

function priceValue(price) {
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function cartSubtotal(items) {
  return items.reduce((sum, item) => sum + priceValue(item.price) * item.qty, 0);
}

function cartMoney(value, items = []) {
  const usesRs = items.some((item) => String(item.price || "").includes("Rs"));
  return usesRs
    ? `Rs. ${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    : `$${value.toFixed(2)}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

function Button({ children, dark = false, ghost = false, href = "/shop" }) {
  return <a className={`btn ${dark ? "btn-dark" : ""} ${ghost ? "btn-ghost" : ""}`} href={href}><span>{children}</span><span>{children}</span></a>;
}

function Kicker({ children }) {
  return <div className="kicker"><span />{children}</div>;
}

function Header({ dark = false, scrolled = false, cartCount = 0, customer, onSearch, onCart, onAccount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["Home", "/"], ["About", "/about"], ["Shop", "/shop"], ["Blog", "/blog"], ["Contact", "/contact"]];

  useEffect(() => {
    document.body.classList.toggle("menu-active", menuOpen);
    return () => document.body.classList.remove("menu-active");
  }, [menuOpen]);

  return (
    <nav className={`nav ${dark ? "nav-dark" : ""} ${scrolled ? "nav-scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <a className="brand-logo nav-logo" href="/" aria-label="EasternWestern home"><img className="nav-logo-mark" src="/assets/easternwestern-logo.png" alt="" /><span className="nav-logo-word">EasternWestern</span></a>
      <div className="nav-links">{links.map(([label, href]) => <a href={href} key={label}><span>{label}</span><span>{label}</span></a>)}</div>
      <div className="nav-actions">
        <button className="search-button" aria-label="Search Icon" onClick={onSearch}><span /></button>
        <button className="account-button" aria-label="Open account" onClick={onAccount}>{customer ? "Account" : "Login"}</button>
        <button className="cart-button" aria-label={`Open cart, ${cartCount} items`} onClick={onCart}><i /><b>{cartCount}</b></button>
        <Button dark={dark} href="/shop">Shop all items</Button>
        <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
      </div>
    </nav>
  );
}

function CartDrawer({ open, items, onClose, onQty, onRemove }) {
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartSubtotal(items);
  return (
    <div className={`cart-shell ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="cart-backdrop" onClick={onClose} />
      <aside className="cart-drawer" role="dialog" aria-label="Shopping cart">
        <div className="cart-head"><div><span>Shopping cart</span><b>{totalItems} items</b></div><button aria-label="Close cart" onClick={onClose}>X</button></div>
        {items.length === 0 ? (
          <div className="cart-empty"><h3>Your cart is empty</h3><p>Add a piece from the shop to start your order.</p><Button dark href="/shop">Shop all items</Button></div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-line" key={item.slug}>
                  <img src={item.image} alt="" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>
                    <div className="qty-row">
                      <button aria-label={`Decrease ${item.name}`} onClick={() => onQty(item.slug, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button aria-label={`Increase ${item.name}`} onClick={() => onQty(item.slug, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-line" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.slug)}>Remove</button>
                </article>
              ))}
            </div>
            <div className="cart-total"><span>Subtotal</span><b>{cartMoney(subtotal, items)}</b></div>
            <a className="cart-checkout" href="/checkout" onClick={onClose}>Checkout details</a>
          </>
        )}
      </aside>
    </div>
  );
}

function CheckoutPage({ items, customerAccount, customerToken, onQty, onRemove, onOrderSuccess, onNeedLogin }) {
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartSubtotal(items);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [proofUploading, setProofUploading] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderComplete, setOrderComplete] = useState("");
  const updateCustomer = (field, value) => setCustomer((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (!customerAccount) return;
    setCustomer((current) => ({
      ...current,
      name: current.name || customerAccount.name || "",
      email: current.email || customerAccount.email || "",
      phone: current.phone || customerAccount.phone || "",
    }));
  }, [customerAccount]);

  const uploadProof = async (file) => {
    if (!file) return;
    setProofUploading(true);
    setOrderMessage("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch("/api/uploads/payment-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, dataUrl }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Upload failed");
      setPaymentProofUrl(payload.url);
      setOrderMessage("Payment proof uploaded");
    } catch (error) {
      setOrderMessage(error.message);
    } finally {
      setProofUploading(false);
    }
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!customerAccount) {
      setOrderMessage("Login required for order tracking");
      onNeedLogin?.();
      return;
    }
    if (paymentMethod !== "Cash on Delivery" && !paymentProofUrl) {
      setOrderMessage("Upload payment proof first");
      return;
    }
    setOrderMessage("Saving order...");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}) },
        body: JSON.stringify({ customer, items, paymentMethod, paymentProofUrl }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Order failed");
      setOrderComplete(payload.order.orderNo);
      setOrderMessage("");
      setCustomer({ name: "", email: "", phone: "", address: "" });
      setPaymentMethod("Cash on Delivery");
      setPaymentProofUrl("");
      onOrderSuccess?.();
    } catch (error) {
      setOrderMessage(error.message);
    }
  };

  if (orderComplete) {
    return (
      <section className="section checkout-page checkout-success">
        <Kicker>Order placed</Kicker>
        <h1>Your order is saved</h1>
        <p>Order number: <b>{orderComplete}</b>. Login account mein tracking show ho jayegi.</p>
        <Button dark href="/shop">Continue shopping</Button>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="section checkout-page checkout-success">
        <Kicker>Checkout</Kicker>
        <h1>Your cart is empty</h1>
        <p>Order details page cart items add karne ke baad show hogi.</p>
        <Button dark href="/shop">Shop all items</Button>
      </section>
    );
  }

  return (
    <section className="section checkout-page">
      <div className="checkout-form-panel reveal visible">
        <Kicker>Checkout</Kicker>
        <h1>Complete your order</h1>
        {!customerAccount && <button className="login-to-track" type="button" onClick={onNeedLogin}>Login / create account for tracking</button>}
        <form className="checkout-form checkout-page-form" onSubmit={submitOrder}>
          <input required value={customer.name} onChange={(event) => updateCustomer("name", event.target.value)} placeholder="Full name" />
          <input required type="email" value={customer.email} onChange={(event) => updateCustomer("email", event.target.value)} placeholder="Email" />
          <input required value={customer.phone} onChange={(event) => updateCustomer("phone", event.target.value)} placeholder="Phone" />
          <textarea required value={customer.address} onChange={(event) => updateCustomer("address", event.target.value)} placeholder="Delivery address" />
          <div className="payment-options">
            {["Cash on Delivery", "Bank Transfer", "JazzCash", "Easypaisa"].map((method) => (
              <label key={method}><input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />{method}</label>
            ))}
          </div>
          {paymentMethod !== "Cash on Delivery" && (
            <div className="proof-upload">
              <label>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => uploadProof(event.target.files?.[0])} />
                {proofUploading ? "Uploading proof..." : paymentProofUrl ? "Change proof" : "Upload payment proof"}
              </label>
              {paymentProofUrl && <img src={paymentProofUrl} alt="Payment proof" />}
            </div>
          )}
          <button className="cart-checkout" type="submit">Place order</button>
          {orderMessage && <p>{orderMessage}</p>}
        </form>
      </div>
      <aside className="checkout-summary reveal visible">
        <span>Order summary</span>
        <h2>{totalItems} items</h2>
        <div className="checkout-items">
          {items.map((item) => (
            <article className="checkout-line" key={item.slug}>
              <img src={item.image} alt="" />
              <div>
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <div className="qty-row">
                  <button aria-label={`Decrease ${item.name}`} onClick={() => onQty(item.slug, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button aria-label={`Increase ${item.name}`} onClick={() => onQty(item.slug, item.qty + 1)}>+</button>
                </div>
              </div>
              <button className="remove-line" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.slug)}>Remove</button>
            </article>
          ))}
        </div>
        <div className="checkout-total-row"><span>Subtotal</span><b>{cartMoney(subtotal, items)}</b></div>
      </aside>
    </section>
  );
}

function SearchOverlay({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="search-overlay" role="dialog" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="search-box"><span /><input autoFocus placeholder="Search..." aria-label="Search products" /><button aria-label="Close search" onClick={onClose}>X</button></div>
    </div>
  );
}

function FormIcon({ type }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19c1.1-3.6 3.3-5.4 6.5-5.4s5.4 1.8 6.5 5.4" /></>,
    mail: <><path d="M4 6.5h16v11H4z" /><path d="m4.5 7 7.5 6 7.5-6" /></>,
    phone: <path d="M7.3 4.8 10 7.5 8.6 10c1.1 2.3 3 4.2 5.4 5.4l2.4-1.4 2.8 2.8c-.5 1.6-1.8 2.5-3.5 2.3C9.9 18.5 5.5 14.1 4.9 8.3 4.7 6.6 5.7 5.3 7.3 4.8z" />,
    lock: <><path d="M7 10h10v9H7z" /><path d="M9 10V7.8a3 3 0 0 1 6 0V10" /></>,
    x: <><path d="M7 7l10 10" /><path d="M17 7 7 17" /></>,
  };
  return <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

function CustomerPanel({ open, token, customer, onClose, onAuth, onLogout }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const loadOrders = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/customer/orders", { headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Orders failed");
      setOrders(payload.orders || []);
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => {
    if (open && token) loadOrders();
  }, [open, token]);
  const submit = async (event) => {
    event.preventDefault();
    setMessage("Please wait...");
    try {
      const path = mode === "login" ? "/api/customers/login" : "/api/customers/register";
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Login failed");
      onAuth(payload.customer, payload.token);
      setMessage("");
      setForm({ name: "", email: "", phone: "", password: "" });
    } catch (error) {
      setMessage(error.message);
    }
  };
  if (!open) return null;
  return (
    <div className="customer-shell open" role="dialog" aria-label="Customer account" aria-modal="true">
      <div className="customer-backdrop" onClick={onClose} />
      <section className={`customer-modal ${customer ? "dashboard-modal" : ""}`}>
        <div className="cart-head customer-head"><div><span>Customer account</span><b>{customer ? customer.name : "Login required"}</b></div><button className="icon-close" aria-label="Close account" onClick={onClose}><FormIcon type="x" /></button></div>
        {!customer ? (
          <form className="customer-form" onSubmit={submit}>
            <div className="auth-tabs">
              {["login", "register"].map((item) => <button type="button" className={mode === item ? "active" : ""} onClick={() => setMode(item)} key={item}><FormIcon type={item === "login" ? "lock" : "user"} /><span>{item}</span></button>)}
            </div>
            {mode === "register" && <label className="auth-field"><FormIcon type="user" /><input required value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Full name" /></label>}
            <label className="auth-field"><FormIcon type="mail" /><input required type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="Email" /></label>
            {mode === "register" && <label className="auth-field"><FormIcon type="phone" /><input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="Phone" /></label>}
            <label className="auth-field"><FormIcon type="lock" /><input required type="password" value={form.password} onChange={(event) => updateForm("password", event.target.value)} placeholder="Password" /></label>
            <button className="auth-submit" type="submit"><FormIcon type={mode === "login" ? "lock" : "user"} />{mode === "login" ? "Login" : "Create account"}</button>
            {message && <p>{message}</p>}
          </form>
        ) : (
          <div className="customer-dashboard">
            <div className="account-summary"><b>{customer.email}</b><span>{customer.phone}</span><button type="button" onClick={onLogout}>Logout</button></div>
            <button className="refresh-orders" type="button" onClick={loadOrders}>Refresh orders</button>
            {message && <p>{message}</p>}
            <div className="customer-orders">
              {orders.length ? orders.map((order) => (
                <article key={order.id || order.orderNo}>
                  <div><b>{order.orderNo}</b><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
                  <p>{order.status} - {order.paymentMethod} - {order.paymentStatus}</p>
                  {order.deliveryDays && <p>Delivery: {order.deliveryDays} days</p>}
                  {order.estimatedDeliveryDate && <p>Expected: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}</p>}
                  {order.trackingNote && <p>{order.trackingNote}</p>}
                  <small>{order.items?.map((item) => `${item.name} x${item.qty}`).join(", ")}</small>
                </article>
              )) : <p className="cart-empty-text">No orders yet.</p>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SaleBar({ settings }) {
  const text = String(settings?.offerText || "").trim();
  if (settings?.offerEnabled === false || !text) return null;
  return <div id="offer-bar" className="sale"><div>{Array(12).fill(text).map((x, i) => <span key={i}>{x}</span>)}</div></div>;
}

function ProductCard({ item, listing = false }) {
  const [tag, name, slug, price, old, image, hover] = item;
  const displayTag = listing ? (item.tags || []).find((label) => /^(save|new in|fabric)/i.test(label)) || tag : tag;
  return (
    <a className={`product-card reveal ${listing ? "catalog-card" : ""}`} href={slugPath("shop", slug)}>
      <div className="product-media">
        {image ? <img src={image} alt={name} /> : <div className="media-placeholder">No image</div>}
        {hover && hover !== image && <img src={hover} alt={name} />}
        <div className="tag">{displayTag}</div>
        {listing && <span className="quick-add">Choose options</span>}
      </div>
      <div className="product-info">
        {listing ? (
          <>
            <h3>{name}</h3>
            <small>{item.category || "EasternWestern New In"}</small>
            <div className="price-row"><span>Sale price</span><b>{price}</b>{old && <s>Regular price {old}</s>}</div>
          </>
        ) : (
          <>
            <h3>{name}</h3>
            <div><b>{price}</b>{old && <s>{old}</s>}</div>
          </>
        )}
      </div>
      <div className="swatches"><i /><i /><i /></div>
    </a>
  );
}

function Products({ title, subtitle, items = [], id = "shop" }) {
  const sectionClass = title === "New Arrivals" ? "products-new" : title === "Best sellers" ? "products-best" : "";
  return (
    <section id={id} className={`section products ${sectionClass}`}>
      <div className="section-head reveal">
        <div><Kicker>{title}</Kicker><h2>{subtitle}</h2></div>
        <Button dark href="/shop">See all collections</Button>
      </div>
      {items.length ? <div className="product-grid">{items.map((item) => <ProductCard key={item[1]} item={item} />)}</div> : <EmptyState title="No listings yet" text="Add real products from the dashboard." />}
    </section>
  );
}

function EmptyState({ title, text }) {
  return <div className="empty-state reveal visible"><h3>{title}</h3><p>{text}</p></div>;
}

function ReviewSection({ content }) {
  const review = { ...fallbackSiteData.content.sections.review, ...(content?.sections?.review || {}) };
  const reviews = Array.isArray(content?.reviewItems) && content.reviewItems.length ? content.reviewItems : fallbackSiteData.content.reviewItems;
  const [activeReview, setActiveReview] = useState(0);
  useEffect(() => {
    if (activeReview >= reviews.length) setActiveReview(0);
  }, [activeReview, reviews.length]);
  useEffect(() => {
    if (reviews.length <= 1) return undefined;
    const timer = window.setInterval(() => setActiveReview((index) => (index + 1) % reviews.length), 4200);
    return () => window.clearInterval(timer);
  }, [reviews.length]);
  const goReview = (direction) => setActiveReview((index) => (index + direction + reviews.length) % reviews.length);
  return (
    <section id="reviews" className="section review">
      <div className="center-head reveal"><Kicker>{review.kicker}</Kicker><h2>{review.title}</h2><p>{review.text}</p></div>
      <div className="review-slider reveal">
        <button type="button" onClick={() => goReview(-1)} aria-label="Previous review">&lt;</button>
        <div className="review-window">
          <div className="review-track" style={{ transform: `translateX(-${activeReview * 100}%)` }}>
            {reviews.map((item, index) => (
              <article className="review-card" key={`${item.name}-${index}`}>
                <div className="stars">{item.rating} <span>{item.summary}</span></div>
                <p>{item.quote}</p>
                <div className="person"><img src={item.image} alt="" /><div><b>{item.name}</b><span>{item.role}</span></div></div>
              </article>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => goReview(1)} aria-label="Next review">&gt;</button>
      </div>
      <div className="review-dots">
        {reviews.map((item, index) => <button type="button" className={activeReview === index ? "active" : ""} onClick={() => setActiveReview(index)} key={`${item.name}-${index}`} aria-label={`Show review ${index + 1}`} />)}
      </div>
    </section>
  );
}

function FeaturesSection({ content }) {
  const section = { ...fallbackSiteData.content.sections.features, ...(content?.sections?.features || {}) };
  const cards = Array.isArray(content?.featureCards) && content.featureCards.length ? content.featureCards : fallbackSiteData.content.featureCards;
  return (
    <section id="features" className="section features">
      <div className="center-head reveal"><Kicker>{section.kicker}</Kicker><h2>{section.title}</h2><p>{section.text}</p></div>
      <div className="feature-grid">{cards.map((card, i) => <article className="feature reveal" key={`${card.title}-${i}`}><img src={card.image || socials[i + 2]} alt="" /><h3>{card.title}</h3><p>{card.text}</p><div>{(card.tags || []).map((x) => <span key={x}>{x}</span>)}</div></article>)}</div>
    </section>
  );
}

function CollectionsSection({ content }) {
  const liveCollections = Array.isArray(content?.collections) && content.collections.length
    ? content.collections.map((item) => [item.tag, item.name, item.title, item.text, item.price, item.oldPrice, item.image])
    : collections;
  return (
    <section id="collections" className="section collections">
      <div className="section-head reveal">
        <div><Kicker>Our Collections</Kicker><h2>Modern collections defined by simplicity</h2></div>
        <Button dark href="/shop">Shop all items</Button>
      </div>
      {liveCollections.map((c, i) => (
        <div className={`collection reveal ${i % 2 ? "flip" : ""}`} key={c[1]}>
          <div className="collection-copy">
            <div className="tag">{c[0]}</div><h4>{c[1]}</h4><h3>{c[2]}</h3><p>{c[3]}</p>
            <small>Pricing start from:</small><strong>{c[4]} <s>{c[5]}</s></strong><Button dark href="/shop">All collections</Button>
          </div>
          <div className="collection-img"><img src={c[6]} alt={c[1]} /></div>
        </div>
      ))}
    </section>
  );
}

function BlogList({ compact = false, posts: suppliedPosts, allPosts = blogs, content }) {
  const posts = suppliedPosts || (compact ? allPosts : allPosts.slice(0, 3));
  const section = { ...fallbackSiteData.content.sections.blogList, ...(content?.sections?.blogList || {}) };
  return (
    <section id={compact ? "blog-list" : "home-blog"} className={`section blog ${compact ? "blog-index" : ""}`}>
      {!compact && <div className="section-head reveal"><div><Kicker>{section.kicker}</Kicker><h2>{section.title}</h2></div><Button dark href="/blog">Read all blogs</Button></div>}
      {posts.length ? <div className="blog-grid">{posts.map((b, i) => <a className={`blog-card reveal ${i === 0 ? "large" : ""}`} href={slugPath("blog", b[2])} key={b[1]}>{b[6] ? <img src={b[6]} alt="" /> : <div className="media-placeholder">No image</div>}<div><span>{b[0]}</span><h3>{b[1]}</h3>{(!compact || i === 0) && <p>{b[3]}</p>}<small>{b[4]} <b>{b[5]}</b></small></div></a>)}</div> : <EmptyState title="No blogs yet" text="Add real blog posts from the dashboard." />}
    </section>
  );
}

function SocialSection({ content }) {
  const section = { ...fallbackSiteData.content.sections.social, ...(content?.sections?.social || {}) };
  const images = Array.isArray(content?.socialImages) && content.socialImages.length ? content.socialImages : fallbackSiteData.content.socialImages;
  return (
    <section id="social" className="social-section">
      <div className="center-head reveal"><Kicker>{section.kicker}</Kicker><h2>{String(section.title || "").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p>{section.text}</p><div className="row"><Button dark href="/shop">See collections</Button><Button href="/contact">Contact us</Button></div></div>
      <div className="social-collage">{images.map((src, i) => <img src={src} key={`${src}-${i}`} alt="" />)}</div>
    </section>
  );
}

function Footer({ settings = fallbackSiteData.content.settings }) {
  const footerSettings = { ...fallbackSiteData.content.settings, ...settings };
  const socialLinks = [["Instagram", "https://instagram.com/"], ["Dribbble", "https://dribbble.com/"], ["Facebook", "https://facebook.com/"], ["Twitter", "https://x.com/"], ["Youtube", "https://youtube.com/"]];
  return (
    <footer id="footer">
      <div className="newsletter"><h3>Subscribe to<br />our news later</h3><form><input placeholder="Enter email" /><button>Subscribe</button></form></div>
      <div className="footer-grid">
        <div><a className="brand-logo footer-logo" href="/" aria-label="EasternWestern home"><img src={footerSettings.logoUrl || "/assets/easternwestern-logo.png"} alt="EasternWestern" /></a><p>{footerSettings.footerText}</p><Button href="/contact">Contact EasternWestern</Button></div>
        <div><h4>Quick Links</h4>{[["Home", "/"], ["About", "/about"], ["Blog", "/blog"], ["Shop", "/shop"], ["Reviews", "/about"], ["Styles", "/blog"]].map(([x, href]) => <a href={href} key={x}>{x}</a>)}</div>
        <div><h4>Follow us:</h4>{socialLinks.map(([label, href]) => <a href={href} key={label} target="_blank" rel="noreferrer">{label}</a>)}</div>
        <div><h4>Get in touch</h4><a href={`mailto:${footerSettings.contactEmail}`}>{footerSettings.contactEmail}</a><a href={`tel:${footerSettings.contactPhone}`}>{footerSettings.contactPhone}</a><a href={`https://maps.google.com/?q=${encodeURIComponent(footerSettings.contactAddress || "")}`} target="_blank" rel="noreferrer">{footerSettings.contactAddress}</a></div>
      </div>
      <div className="footer-word">{footerSettings.brandName || "EasternWestern"}</div>
    </footer>
  );
}

function pageHero(content, key) {
  return { ...fallbackSiteData.content.pageHeroes[key], ...(content?.pageHeroes?.[key] || {}) };
}

const shopPickTabs = ["UNSTITCHED", "READY TO WEAR", "LUXURY PRET", "FREEDOM TO BUY", "MEN", "ACCESSORIES"];

function productGroups(products = []) {
  return {
    "All Products": products,
    "UNSTITCHED": products.filter((item) => String(item.category || "").includes("UNSTITCHED")),
    "READY TO WEAR": products.filter((item) => String(item.category || "").includes("READY")),
    "LUXURY PRET": products.filter((item) => String(item.category || "").includes("LUXURY")),
    "FREEDOM TO BUY": products.filter((item) => String(item.category || "").includes("FABRIC")),
    "MEN": products.filter((item) => String(item.category || "").includes("MEN")),
    "ACCESSORIES": products.filter((item) => String(item.category || "").includes("ACCESS")),
    "Sale": products.filter((item) => String(item[0] || "").includes("Save") || (item.tags || []).some((tag) => String(tag).includes("Save"))),
  };
}

function PopularPicks({ products = [], active = "UNSTITCHED", onSelect }) {
  const [localActive, setLocalActive] = useState(active);
  const selected = onSelect ? active : localActive;
  const groups = productGroups(products);
  const currentProducts = groups[selected]?.length ? groups[selected] : products;
  const pickProducts = [...currentProducts, ...products.filter((item) => !currentProducts.includes(item))].slice(0, 4);
  const choose = (label) => {
    if (onSelect) onSelect(label);
    else setLocalActive(label);
  };
  return (
    <section className="popular-picks">
      <p>DISCOVER OUR MOST-POPULAR PICKS</p>
      <div className="pick-tabs">
        {shopPickTabs.map((label) => <button className={selected === label ? "active" : ""} onClick={() => choose(label)} key={label}>{label}</button>)}
      </div>
      {pickProducts.length ? (
        <div className="pick-grid">
          {pickProducts.map((item) => (
            <a href={slugPath("shop", item[2])} className="pick-tile" key={item[2]}>
              <img src={item[5]} alt={item[1]} />
            </a>
          ))}
        </div>
      ) : <EmptyState title="No listings yet" text="Add products from the dashboard." />}
    </section>
  );
}

function HomePage({ data }) {
  const settings = { ...fallbackSiteData.content.settings, ...(data.content?.settings || {}) };
  const sourceSlides = data.content?.heroSlides?.length ? data.content.heroSlides : fallbackSiteData.content.heroSlides;
  const slides = sourceSlides.map((slide) => [slide.label, slide.image]).filter((slide) => slide[1]);
  const homeArrivals = data.products.filter((item) => item[0] === "New").slice(0, 9);
  const homeSellers = data.products.filter((item) => item[0] === "Best seller").slice(0, 6);
  const [activeSlide, setActiveSlide] = useState(Math.min(3, Math.max(slides.length - 1, 0)));

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = window.setTimeout(() => {
      setActiveSlide((activeSlide + 1) % slides.length);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [activeSlide, slides.length]);

  const slideIndex = Math.min(activeSlide, slides.length - 1);
  const activeHero = slides[slideIndex] || ["Arctic", hero];
  const about = { ...fallbackSiteData.content.sections.about, ...(data.content?.sections?.about || {}) };

  return (
    <>
      <section id="home-hero" className="hero">
        <img key={activeHero[1]} src={activeHero[1]} alt="Modern black leather outfit" />
        <div className="hero-overlay" />
        <div className="hero-copy reveal visible">
          <div className="hero-tag"><span>{settings.heroKicker}</span><b>{settings.heroCompanion}</b></div>
          <h1>{String(settings.heroTitle || "").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
          <p>{settings.heroText}</p>
          <div className="row"><Button href="/shop">See all collections</Button><Button ghost href="/contact">Contact us</Button></div>
        </div>
        <div className="thumbs">{slides.map(([label, src], i) => <button className={i === slideIndex ? "active" : ""} onClick={() => setActiveSlide(i)} key={label} aria-label={`Show ${label} collection`}><img src={src} alt="" /><span>{label}</span></button>)}</div>
      </section>
      <PopularPicks products={data.products} />
      <Products id="new-arrivals" title="New Arrivals" subtitle="Fresh fits in our latest drop" items={homeArrivals} />
      <section id="about" className="about-hero">
        <video autoPlay muted loop playsInline poster={about.poster || "/assets/story-poster.png"}><source src="/assets/story.mp4" type="video/mp4" /></video>
        <div className="hero-overlay" />
        <div className="about-copy reveal"><img src={about.logo || logo} alt="" /><p>{about.year}</p><h2>{about.title}</h2><p>{about.text}</p><div className="row"><Button href="/about">More about us</Button><Button ghost href="/contact">Contact us</Button></div></div>
      </section>
      <Products id="best-sellers" title="Best sellers" subtitle="Our signature best selling pieces" items={homeSellers} />
      <CollectionsSection content={data.content} />
      <ReviewSection content={data.content} />
      <FeaturesSection content={data.content} />
      <BlogList allPosts={data.blogs} content={data.content} />
      <SocialSection content={data.content} />
    </>
  );
}

function PageHero({ kicker, companion, title, text, image = hero, id = "page-hero" }) {
  return (
    <section id={id} className="page-hero">
      <img src={image} alt="" />
      <div className="hero-overlay" />
      <div className="page-hero-copy reveal visible">
        <div className="hero-tag"><span>{kicker}</span><b>{companion}</b></div>
        <h1>{title}</h1><p>{text}</p>
        <div className="row"><Button href="/shop">Browse collections</Button><Button ghost href="/about">About us</Button></div>
      </div>
    </section>
  );
}

function AboutPage({ content }) {
  const heroContent = pageHero(content, "about");
  const aboutTrust = { ...fallbackSiteData.content.sections.aboutTrust, ...(content?.sections?.aboutTrust || {}) };
  const aboutStats = { ...fallbackSiteData.content.sections.aboutStats, ...(content?.sections?.aboutStats || {}) };
  const liveStats = Array.isArray(content?.statCards) && content.statCards.length ? content.statCards : fallbackSiteData.content.statCards;
  const avatarImages = Array.isArray(content?.avatarImages) && content.avatarImages.length ? content.avatarImages : fallbackSiteData.content.avatarImages;
  const brandImages = Array.isArray(content?.brandImages) && content.brandImages.length ? content.brandImages : fallbackSiteData.content.brandImages;
  return (
    <>
      <PageHero {...heroContent} id="about-hero" />
      <section id="about-trust" className="section rating-strip reveal">
        <div className="rating-copy"><div className="avatar-stack">{avatarImages.map((src, i) => <img src={src} key={`${src}-${i}`} alt="" />)}</div><div><b>{aboutTrust.rating}</b><p>{aboutTrust.text}</p></div></div>
        <div className="brand-marquee"><div>{brandImages.map((src, i) => <img src={src} key={`${src}-${i}`} alt="" />)}</div></div>
      </section>
      <section id="about-stats" className="section about-stats">
        <div className="center-head reveal"><Kicker>{aboutStats.kicker}</Kicker><h2>{aboutStats.title}</h2></div>
        <div className="stats-grid">{liveStats.map((s) => <article className="stat-card reveal" key={s.value}><img src={s.image} alt="" /><div><h2>{s.value}</h2><p>{s.label}</p></div></article>)}</div>
      </section>
      <SocialSection content={content} />
    </>
  );
}

function ShopPage({ products, content }) {
  const [filter, setFilter] = useState("UNSTITCHED");
  const heroContent = pageHero(content, "shop");
  const listings = products;
  const groups = productGroups(listings);
  const currentProducts = groups[filter]?.length ? groups[filter] : listings;
  return (
    <>
      <PageHero {...heroContent} id="shop-hero" />
      <PopularPicks products={listings} active={filter} onSelect={setFilter} />
      <section id="shop-listings" className="section catalog-section">
        <aside className="catalog-sidebar">
          <h3>Categories</h3>
          {Object.keys(groups).map((label) => <button className={filter === label ? "active" : ""} onClick={() => setFilter(label)} key={label}>{label}</button>)}
          <h3>Availability</h3>
          <label><input type="checkbox" /> In stock only</label>
          <h3>By Price</h3>
          <label><input type="checkbox" /> Rs. 0 to Rs. 3,000</label>
          <label><input type="checkbox" /> Rs. 3,000 to Rs. 6,000</label>
          <label><input type="checkbox" /> Rs. 6,000 to Rs. 15,000</label>
          <h3>By Pieces</h3>
          <label><input type="checkbox" /> 1 Piece</label>
          <label><input type="checkbox" /> 2 Pieces</label>
          <label><input type="checkbox" /> 3 Pieces</label>
          <h3>By Type</h3>
          <label><input type="checkbox" /> Embroidered</label>
          <label><input type="checkbox" /> Printed</label>
          <span>{currentProducts.length} products</span>
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div><b>{filter}</b><span>{currentProducts.length} products</span></div>
            <select aria-label="Sort products"><option>Featured</option><option>Best selling</option><option>Price, low to high</option><option>Price, high to low</option></select>
          </div>
          {currentProducts.length ? <div className="product-grid listing-grid">{currentProducts.map((item) => <ProductCard key={item[1]} item={item} listing />)}</div> : <EmptyState title="No listings yet" text="Add real products from the dashboard." />}
        </div>
      </section>
      <SocialSection content={content} />
    </>
  );
}

function ProductPage({ slug, products, onAddToCart }) {
  const sourceProducts = products;
  const product = sourceProducts.find((p) => p[2] === slug) || sourceProducts[0];
  const gallery = product ? (product.media?.length ? product.media : [product[5], product[6]]).filter(Boolean) : [];
  const firstImage = gallery[0] || "";
  const [activeImage, setActiveImage] = useState(firstImage);
  useEffect(() => {
    setActiveImage(firstImage);
  }, [firstImage, slug]);
  if (!product) return <><PageHero kicker="Shop" companion="No product" title="Product not found" text="Add real products from the dashboard." image={hero} /><SocialSection /></>;
  const relatedProducts = sourceProducts.filter((item) => item[2] !== product[2]).slice(0, 3);
  const specs = [["Material", "Premium organic cotton textured knit"], ["Care", "Machine wash cold, lay flat"], ["Warranty", "One year full quality guarantee"]];
  const trust = [["Trusted Quality", "Every piece is checked to ensure it meets our standards."], ["Real Time Tracking", "Get live updates from our warehouse to your doorstep."], ["Secure Payments", "Shop confidently with our secure, encrypted checkout."], ["Easy Returns", "Change your mind? Return any item easily within thirty days."]];
  return (
    <>
      <section className="section product-detail">
        <div className="product-main reveal">
          <div className="tag">{product[0]}</div>
          {activeImage ? <img src={activeImage} alt={product[1]} /> : <div className="media-placeholder">No image</div>}
          <div className="product-thumbnails">{gallery.map((src, i) => <button className={src === activeImage ? "active" : ""} onClick={() => setActiveImage(src)} key={`${src}-${i}`} aria-label={`View ${product[1]} image ${i + 1}`}><img src={src} alt="" /></button>)}</div>
        </div>
        <div className="product-panel reveal">
          <div className="breadcrumbs"><b>Shop</b><span />{product.category || "Listing"}</div>
          <h1>{product[1]}</h1>
          <div className="detail-price"><b>USD {product[3]}</b><s>USD {product[4]}</s></div>
          <p>{product[7]}</p>
          {product.variants?.length > 0 && <div className="variant-list">{product.variants.map((variant, i) => <span key={`${variant.sku}-${i}`}>{[variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku}</span>)}</div>}
          <button className="btn btn-dark cart-add-btn" onClick={() => onAddToCart(product)}><span>Add to cart</span><span>Added to cart</span></button>
          <div className="spec-list">{specs.map(([title, text]) => <div key={title}><b>{title}</b><span>{text}</span></div>)}</div>
        </div>
        <div className="trust-grid reveal">{trust.map(([title, text], i) => <article key={title}><i>{i + 1}</i><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="section related-products">
        <div className="section-head reveal">
          <div><Kicker>More styles</Kicker><h2>You may also like</h2></div>
          <Button dark href="/shop">Shop all items</Button>
        </div>
        {relatedProducts.length ? <div className="product-grid">{relatedProducts.map((item) => <ProductCard key={item[1]} item={item} />)}</div> : <EmptyState title="No related listings" text="Add more products from the dashboard." />}
      </section>
      <SocialSection />
    </>
  );
}

function BlogPage({ posts, content }) {
  const [filter, setFilter] = useState("All Blogs");
  const heroContent = pageHero(content, "blog");
  const filtered = filter === "All Blogs" ? posts : posts.filter((post) => post[0] === filter);
  return (
    <>
      <PageHero {...heroContent} id="blog-hero" />
      <section className="section shop-filter reveal">{["All Blogs", "Style Guide", "Fashion Tips", "Brand Stories"].map((label) => <button className={filter === label ? "active" : ""} onClick={() => setFilter(label)} key={label}>{label}</button>)}</section>
      <BlogList compact posts={filtered} allPosts={posts} />
      <SocialSection content={content} />
    </>
  );
}

function BlogDetailPage({ slug, posts }) {
  const post = posts.find((b) => b[2] === slug) || posts[0];
  if (!post) return <><PageHero kicker="Blog" companion="No post" title="Blog not found" text="Add real blog posts from the dashboard." image={hero} /><SocialSection /></>;
  const bodyBlocks = String(post[7] || "").split(/\n+/).map((block) => block.trim()).filter(Boolean);
  return (
    <>
      <section className="article-hero">
        <img src={post[6]} alt="" />
        <div className="article-title reveal visible"><Kicker>{post[0]}</Kicker><h1>{post[1]}</h1><p>{post[3]}</p><small>{post[4]} - {post[5]}</small></div>
      </section>
      <article className="article-body reveal">
        {bodyBlocks.length ? bodyBlocks.map((block, index) => index === 0 ? <h2 key={block}>{block}</h2> : <p key={block}>{block}</p>) : <>
        <h2>1. Why Quality Matters</h2>
        <p>Finding the right balance between comfort and aesthetics is the foundation of modern fashion. It is not about how many items you own, but how those items work together to create a cohesive look that feels both effortless and intentional.</p>
        <ul><li>Durability: Premium fabrics ensure your pieces last through seasons of wear.</li><li>Versatility: A neutral base allows you to mix and match with ease.</li><li>Comfort: Well-tailored silhouettes provide confidence throughout the day.</li></ul>
        <h2>2. Essential Pieces Every Closet Needs</h2>
        <p>True style starts with the basics. Investing in a few core items allows you to build a signature look without overcomplicating your daily routine. Look for pieces that speak to your personality while maintaining a clean, sophisticated edge.</p>
        <ul><li>Heavyweight Tees: Look for high-density cotton for a structured, boxy fit.</li><li>Relaxed Trousers: Transition from day to night with ease and elegance.</li><li>Statement Outerwear: A bold coat or leather jacket elevates any simple outfit.</li></ul>
        <h2>3. Three Golden Styling Rules</h2>
        <p>1. Focus on the Silhouette Always balance your proportions. If you are wearing oversized bottoms, consider a more structured top to maintain a clean visual line.</p>
        <p>2. Stick to Tonal Palettes Monochrome dressing is the fastest way to look expensive. Experiment with different shades of the same color, like charcoal, slate, and black.</p>
        <p>3. Layer with Intention Layering is an art form. Use different textures like leather over knitwear to add depth and visual interest to a simple ensemble.</p>
        <h2>Bonus Tips</h2>
        <p>Mastering your personal style is a journey of trial and error. Don't be afraid to break the rules once you understand them, but always prioritize how a garment makes you feel over how it looks on a hanger.</p>
        <ul><li>Tailoring: A small adjustment to the hem can change the entire vibe.</li><li>Accessories: Minimal jewelry adds a polished finish without distraction.</li><li>Confidence: The best outfit is always the one worn with complete self-assurance.</li></ul>
        <div className="article-images"><img src="/assets/77.jpeg" alt="Minimal street style" /><img src="/assets/78.jpeg" alt="Minimal street style" /></div>
        <a className="next-blog" href="/blog/elevate-everyday-outfits-using-modern-minimalist-styling">Next blog <span>+</span></a>
        </>}
      </article>
      <SocialSection />
    </>
  );
}

function ContactPage({ content }) {
  const [sent, setSent] = useState(false);
  const heroContent = pageHero(content, "contact");
  const settings = { ...fallbackSiteData.content.settings, ...(content?.settings || {}) };
  const contactInfo = { ...fallbackSiteData.content.sections.contactInfo, ...(content?.sections?.contactInfo || {}) };
  return (
    <>
      <PageHero {...heroContent} id="contact-hero" />
      <section id="contact-info" className="section contact-layout">
        <div className="contact-cards reveal">
          {[[contactInfo.emailIcon, settings.contactEmail, "Email Address"], [contactInfo.phoneIcon, settings.contactPhone, "Phone Number"], [contactInfo.addressIcon, settings.contactAddress, "Location"]].map(([icon, value, label]) => <article key={label}><img src={icon} alt="" /><b>{value}</b><span>{label}</span></article>)}
        </div>
        <div className="contact-main reveal">
          <img src={contactInfo.image} alt="Woman in blue modern outfit" />
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            <label>First Name<input required placeholder="Nasir" /></label><label>Last Name<input required placeholder="Nawaz" /></label>
            <label>Email<input type="email" required placeholder="test@gmail.com" /></label><label>Phone No<input placeholder="+123 456 789 00" /></label>
            <label className="wide">Subject<input required placeholder="Enquiry ...." /></label><label className="wide">Message<textarea required placeholder="Enter message here..." /></label>
            <button className="wide" type="submit">{sent ? "Message Sent" : "Send Message"}</button>
          </form>
        </div>
      </section>
      <SocialSection content={content} />
    </>
  );
}

function NotFoundPage() {
  return <PageHero kicker="404" title="Page not found" text="This route is not part of the EasternWestern site." image={hero} />;
}

function Router({ data, onAddToCart, cartItems, customerAccount, customerToken, onQty, onRemove, onOrderSuccess, onNeedLogin }) {
  const pathname = window.location.pathname;
  if (pathname.startsWith("/admin")) return <AdminDashboard />;
  if (pathname === "/") return <HomePage data={data} />;
  if (pathname === "/about") return <AboutPage content={data.content} />;
  if (pathname === "/shop") return <ShopPage products={data.products} content={data.content} />;
  if (pathname === "/checkout") return <CheckoutPage items={cartItems} customerAccount={customerAccount} customerToken={customerToken} onQty={onQty} onRemove={onRemove} onOrderSuccess={onOrderSuccess} onNeedLogin={onNeedLogin} />;
  if (pathname === "/blog") return <BlogPage posts={data.blogs} content={data.content} />;
  if (pathname === "/contact") return <ContactPage content={data.content} />;
  if (pathname.startsWith("/shop/")) return <ProductPage slug={pathname.split("/").pop()} products={data.products} onAddToCart={onAddToCart} />;
  if (pathname.startsWith("/blog/")) return <BlogDetailPage slug={pathname.split("/").pop()} posts={data.blogs} />;
  return <NotFoundPage />;
}

function App() {
  const pathname = window.location.pathname;
  const darkHeader = pathname.startsWith("/shop/");
  const [siteData, setSiteData] = useState(() => normalizeSiteData());
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerToken, setCustomerToken] = useState(() => localStorage.getItem("ew-customer-token") || "");
  const [customerAccount, setCustomerAccount] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("easternwestern-cart") || "[]");
    } catch {
      return [];
    }
  });
  const [scrolled, setScrolled] = useState(false);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const addToCart = (product) => {
    const nextItem = cartProduct(product);
    setCartItems((items) => {
      const exists = items.find((item) => item.slug === nextItem.slug);
      if (exists) return items.map((item) => item.slug === nextItem.slug ? { ...item, qty: item.qty + 1 } : item);
      return [...items, { ...nextItem, qty: 1 }];
    });
    setCartOpen(true);
  };
  const saveCustomerAuth = (customer, token) => {
    setCustomerAccount(customer);
    setCustomerToken(token);
    localStorage.setItem("ew-customer-token", token);
  };
  const logoutCustomer = () => {
    setCustomerAccount(null);
    setCustomerToken("");
    localStorage.removeItem("ew-customer-token");
  };
  const updateCartQty = (slug, qty) => {
    setCartItems((items) => qty <= 0 ? items.filter((item) => item.slug !== slug) : items.map((item) => item.slug === slug ? { ...item, qty } : item));
  };
  const removeFromCart = (slug) => setCartItems((items) => items.filter((item) => item.slug !== slug));
  useEffect(() => {
    fetch("/api/public-data")
      .then((response) => response.json())
      .then((payload) => setSiteData(normalizeSiteData(payload)))
      .catch(() => setSiteData(normalizeSiteData()));
  }, []);
  useEffect(() => {
    if (!customerToken) return;
    fetch("/api/customer/me", { headers: { Authorization: `Bearer ${customerToken}` } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Customer login expired")))
      .then((payload) => setCustomerAccount(payload.customer))
      .catch(() => logoutCustomer());
  }, [customerToken]);
  useEffect(() => {
    if (!window.location.hash) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [siteData]);
  useEffect(() => {
    localStorage.setItem("easternwestern-cart", JSON.stringify(cartItems));
  }, [cartItems]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    document.title = "EasternWestern - Modern Clothing E-commerce";
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible"));
    }, { rootMargin: "420px 0px", threshold: 0.01 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  if (pathname.startsWith("/admin")) return <AdminDashboard />;

  return (
    <main>
      <SaleBar settings={siteData.content?.settings || fallbackSiteData.content.settings} />
      <Header dark={darkHeader} scrolled={scrolled} cartCount={cartCount} customer={customerAccount} onSearch={() => setSearchOpen(true)} onCart={() => setCartOpen(true)} onAccount={() => setCustomerOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CustomerPanel open={customerOpen} token={customerToken} customer={customerAccount} onClose={() => setCustomerOpen(false)} onAuth={saveCustomerAuth} onLogout={logoutCustomer} />
      <CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onQty={updateCartQty} onRemove={removeFromCart} />
      <Router data={siteData} onAddToCart={addToCart} cartItems={cartItems} customerAccount={customerAccount} customerToken={customerToken} onQty={updateCartQty} onRemove={removeFromCart} onOrderSuccess={() => setCartItems([])} onNeedLogin={() => setCustomerOpen(true)} />
      <Footer settings={siteData.content?.settings || fallbackSiteData.content.settings} />
    </main>
  );
}

export default App;
