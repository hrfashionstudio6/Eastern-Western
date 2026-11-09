import { checkoutCustomer } from "../shared/checkout-customer.js";
import { trackPageView, trackViewContent, trackAddToCart, trackCheckout, trackPurchase } from "./meta-pixel.js";
import Header from "./StoreHeader.jsx";
import CustomerCarePage from "./CustomerCarePage.jsx";
import { customerCareLinks, customerCarePages } from "../shared/customer-care.js";
import WhatsAppButton from "./WhatsAppButton.jsx";
import { LAUNCH_OFFER_TEXT, whatsappLink, removedStorePath } from "../shared/storefront.js";
import HeroImage from "./HeroImage.jsx";
import { compactHeroSlides } from "../shared/hero-images.js";
import { useCallback, useEffect, useRef, useState } from "react";
import useSiteRoute from "./useSiteRoute.js";
import { withLoading } from "./loading-state.js";
import AdminDashboard from "./AdminDashboard.jsx";
import ArticleDetails, { ColourName } from "./ArticleDetails.jsx";
import ContactForm from "./ContactForm.jsx";
import { routeSlug } from "../shared/route-slug.js";
import { loadProduct } from "../shared/load-product.js";
import { loadSiteData } from "../shared/load-site-data.js";
import { productLabels, productSubcategories, productSubcategory } from "../shared/product-labels.js";
import { searchProducts } from "../shared/product-search.js";
import { filterProducts, pieceOptions, priceRanges, shopQuery, sortOptions, sortProducts } from "../shared/shop-filters.js";
import { formatPKR, priceAmount } from "../shared/money.js";
import { defaultContent } from "../server/defaultData.js";
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

const fallbackSiteData = { content: defaultContent, products: [], blogs: [] };

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
  item.status = product.status;
  item.media = media.length ? media : [image, hoverImage].filter(Boolean);
  item.tags = product.tags || [];
  item.variants = product.variants || [];
  item.featured = product.featured;
  Object.assign(item, productLabels(product));
  item.subcategory = productSubcategory(product);
  for (const field of ["fabric", "care", "shippingTime", "sizeChart", "sizeChartImage"]) item[field] = product[field] || "";
  item.sizeChartTable = product.sizeChartTable || null;
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
  return `/${type}/${encodeURIComponent(slug)}`;
}

function cartProduct(item) {
  const [tag, name, slug, price, old, image] = item;
  return { tag, name, slug, price, old, image };
}

function priceValue(price) {
  return priceAmount(price);
}

function cartSubtotal(items) {
  return items.reduce((sum, item) => sum + priceValue(item.price) * item.qty, 0);
}

function cartMoney(value) {
  return formatPKR(value);
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
                <article className="cart-line" key={item.cartKey || item.slug}>
                  <img src={item.image} alt="" />
                  <div>
                    <h3>{item.name}</h3>{(item.size || item.color) && <div className="cart-option-summary">{item.size && <small>Size: {item.size}</small>}{item.color && <ColourName value={item.color} />}</div>}
                    <p>{formatPKR(item.price)}</p>
                    <div className="qty-row">
                      <button aria-label={`Decrease ${item.name}`} onClick={() => onQty(item.cartKey || item.slug, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button aria-label={`Increase ${item.name}`} onClick={() => onQty(item.cartKey || item.slug, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-line" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.cartKey || item.slug)}>Remove</button>
                </article>
              ))}
            </div>
            <div className="cart-total"><span>Subtotal</span><b>{cartMoney(subtotal, items)}</b></div>
            <a className="cart-checkout" href="/checkout" onClick={onClose}>Checkout</a>
          </>
        )}
      </aside>
    </div>
  );
}

function CheckoutPage({ items, customerAccount, customerToken, onQty, onRemove, onOrderSuccess, onNeedLogin, contactUrl }) {
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartSubtotal(items);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [proofUploading, setProofUploading] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderComplete, setOrderComplete] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingOrder = useRef(false);
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!checkoutTracked.current && items.length) {
      checkoutTracked.current = true;
      trackCheckout(items);
    }
  }, [items]);
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

  const submitOrder = (event) => {
    event.preventDefault();
    return withLoading("Placing your order…", () => submitOrderAction(event));
  };
  const submitOrderAction = async (event) => {
    event.preventDefault();
    if (submittingOrder.current) return;
    let delivery;
    try { delivery = checkoutCustomer(customer, customerAccount); }
    catch (error) { setOrderMessage(error.message); return; }
    if (paymentMethod !== "Cash on Delivery" && !paymentProofUrl) {
      setOrderMessage("Upload payment proof first");
      return;
    }
    submittingOrder.current = true;
    setSubmitting(true);
    setOrderMessage("Saving order...");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}) },
        body: JSON.stringify({ customer: delivery, items, paymentMethod, paymentProofUrl }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Order failed");
      trackPurchase(payload.order);
      setOrderComplete(payload.order.orderNo);
      setOrderMessage("");
      setCustomer({ name: "", email: "", phone: "", address: "" });
      setPaymentMethod("Cash on Delivery");
      setPaymentProofUrl("");
      onOrderSuccess?.();
    } catch (error) {
      setOrderMessage(error.message);
    } finally {
      submittingOrder.current = false;
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    return <section className="section checkout-v2"><div className="co-state"><span className="co-state-mark" aria-hidden="true">✓</span><p className="co-eyebrow">Order placed</p><h1>Thank you for your order</h1><p>Your order number is <strong>{orderComplete}</strong>. Please save this number. We will contact you on your mobile to confirm delivery.</p><a className="co-submit" href="/shop">Continue shopping <span aria-hidden="true">→</span></a></div></section>;
  }

  if (!items.length) {
    return <section className="section checkout-v2"><div className="co-state"><p className="co-eyebrow">Checkout</p><h1>Your cart is empty</h1><p>Find your next Eastern Western look and add it to your cart.</p><a className="co-submit" href="/shop">Explore the collection <span aria-hidden="true">→</span></a></div></section>;
  }

  return (
    <section className="section checkout-v2">
      <header className="co-page-head">
        <div><p className="co-eyebrow">Eastern Western / Checkout</p><h1>Complete your order</h1><p>A few details, and your next look is on its way.</p></div>
        <a className="co-back" href="/shop"><span aria-hidden="true">←</span> Continue shopping</a>
      </header>
      <a className="co-mobile-total" href="#co-summary-title"><span>{totalItems} {totalItems === 1 ? "item" : "items"} · Review order</span><strong>{cartMoney(subtotal, items)}</strong></a>
      <div className="co-layout">
        <div className="co-form-card">
          {!customerAccount && <div className="co-account"><div><strong>Guest checkout</strong><p>No account needed. Sign in only if you prefer.</p></div><button type="button" onClick={onNeedLogin}>Sign in</button></div>}
          <form className="co-form" onSubmit={submitOrder} aria-busy={submitting}>
            <div className="co-section-heading"><span aria-hidden="true">01</span><div><h2>Delivery details</h2><p>Where should we send your order?</p></div></div>
            <div className="co-fields">
              <label htmlFor="co-name">Full name<input id="co-name" name="name" autoComplete="name" maxLength={120} required value={customer.name} onChange={(event) => updateCustomer("name", event.target.value)} placeholder="Your full name" /></label>
              <label htmlFor="co-phone">Mobile number<input id="co-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={25} title="Enter your mobile number, e.g. 0300 1234567" required value={customer.phone} onChange={(event) => updateCustomer("phone", event.target.value)} placeholder="03XX XXXXXXX" /></label>

              <label className="co-wide" htmlFor="co-address">Delivery address<textarea id="co-address" name="address" autoComplete="street-address" rows={3} maxLength={1000} required value={customer.address} onChange={(event) => updateCustomer("address", event.target.value)} placeholder="House / flat, street, area and city" /><small>Please include your city and a nearby landmark.</small></label>
              <label className="co-wide" htmlFor="co-email">Email address (optional)<input id="co-email" name="email" type="email" autoComplete="email" maxLength={254} value={customer.email} onChange={(event) => updateCustomer("email", event.target.value)} placeholder="you@example.com" /><small>For order emails, if you would like them.</small></label>
            </div>
            <fieldset className="co-payment-group">
              <legend><span aria-hidden="true">02</span> Payment method</legend>
              <label className="co-payment"><input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === "Cash on Delivery"} onChange={() => setPaymentMethod("Cash on Delivery")} /><span><strong>Cash on Delivery</strong><small>Pay when your order arrives.</small></span><svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="7" width="22" height="15" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M7 7V5h14v2M7 14h2m10 0h2" stroke="currentColor" strokeWidth="1.4"/><circle cx="14" cy="14.5" r="3" stroke="currentColor" strokeWidth="1.4"/></svg></label>
            </fieldset>
            {paymentMethod !== "Cash on Delivery" && <div className="co-proof"><label>Payment proof<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => uploadProof(event.target.files?.[0])} /></label>{proofUploading && <p role="status">Uploading proof…</p>}{paymentProofUrl && <img src={paymentProofUrl} alt="Payment proof" />}</div>}
            {orderMessage && <p className="co-message" role={orderMessage === "Saving order..." ? "status" : "alert"}>{orderMessage}</p>}
            <button className="co-submit" type="submit" disabled={submitting} data-float-clear>{submitting ? "Placing order…" : "Place order"}<span>{cartMoney(subtotal, items)}</span></button>
            <p className="co-help">Need a hand? <a href={contactUrl} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>
          </form>
        </div>
        <aside className="co-summary" aria-labelledby="co-summary-title">
          <div className="co-summary-head"><h2 id="co-summary-title">Your order</h2><span>{totalItems} {totalItems === 1 ? "item" : "items"}</span></div>
          <div className="co-items">
            {items.map((item) => (
              <article className="co-line" key={item.cartKey || item.slug}>
                <a className="co-photo" href={"/shop/" + encodeURIComponent(item.slug)} aria-label={"View " + item.name}><img src={item.image} alt={item.name} /></a>
                <div className="co-line-body">
                  <div className="co-line-title"><a href={"/shop/" + encodeURIComponent(item.slug)}>{item.name}</a><strong>{formatPKR(priceValue(item.price) * item.qty)}</strong></div>
                  {item.size && <p className="co-size">Size: {item.size}</p>}
                  {item.color && <div className="co-colour"><span>Colour</span><ColourName value={item.color} /></div>}
                  <p className="co-unit-price">{formatPKR(item.price)} each</p>
                  <div className="co-line-actions"><div className="co-quantity"><button type="button" aria-label={"Decrease " + item.name} disabled={item.qty <= 1} onClick={() => onQty(item.cartKey || item.slug, item.qty - 1)}>−</button><output aria-label={"Quantity for " + item.name} aria-live="polite">{item.qty}</output><button type="button" aria-label={"Increase " + item.name} onClick={() => onQty(item.cartKey || item.slug, item.qty + 1)}>+</button></div><button type="button" className="co-remove" aria-label={"Remove " + item.name} onClick={() => onRemove(item.cartKey || item.slug)}>Remove</button></div>
                </div>
              </article>
            ))}
          </div>
          <dl className="co-costs"><div><dt>Subtotal</dt><dd>{cartMoney(subtotal, items)}</dd></div><div><dt>Payment</dt><dd>Cash on Delivery</dd></div><div className="co-total"><dt>Total <small>PKR</small></dt><dd>{cartMoney(subtotal, items)}</dd></div></dl>
          <div className="co-summary-foot"><span aria-hidden="true">✓</span><p>Review your articles and delivery details before placing your order.</p></div>
        </aside>
      </div>
    </section>
  );
}

function SearchOverlay({ open, onClose, products = [] }) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!open) { setQuery(""); return undefined; }
    const escape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open, onClose]);
  if (!open) return null;
  const searchable = products.map((item) => ({ item, name: item[1], sku: item.sku, category: item.category, subcategory: item.subcategory, tags: item.tags, variants: item.variants }));
  const results = searchProducts(searchable, query).map((match) => match.item);
  return (
    <div className="search-overlay" role="dialog" aria-label="Search articles" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="search-panel">
        <div className="search-box"><span /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, code or colour" aria-label="Search products" aria-controls="search-results" /><button type="button" aria-label="Close search" onClick={onClose}>X</button></div>
        {query.trim() && <div id="search-results" className="search-results" role="region" aria-live="polite" aria-label="Search results">
          {results.length ? results.slice(0, 8).map((item) => (
            <a className="search-result" href={slugPath("shop", item[2])} key={item.id || item[2]}>
              {item[5] ? <img src={item[5]} alt="" /> : <span className="search-result-noimg" />}
              <span><b>{item[1]}</b><small>{[item.category, item.variants?.[0]?.color].filter(Boolean).join(" · ")}</small></span>
              <strong>{formatPKR(item[3])}</strong>
            </a>
          )) : <p className="search-empty">No articles match “{query.trim()}”. Try a name, article code or colour.</p>}
          {results.length > 8 && <a className="search-all" href="/shop">See all {results.length} results in the shop</a>}
        </div>}
      </div>
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
  const configured = String(settings?.offerText || "").trim();
  const text = !configured || /^Eastern\s?Western$/i.test(configured) ? LAUNCH_OFFER_TEXT : configured;
  if (settings?.offerEnabled === false) return null;
  return <div id="offer-bar" className="launch-offer"><div className="launch-offer-track">{[0, 1].map(group => <div className="launch-offer-group" key={group} aria-hidden={group ? "true" : undefined}>{Array.from({ length: 4 }, (_, index) => <span key={index} aria-hidden={!group && index ? "true" : undefined}>{text}</span>)}</div>)}</div></div>;
}

function ProductCard({ item, listing = false }) {
  const [, name, slug, price, old, image, hover] = item;
  const colors = [...new Map((item.variants || []).map((variant) => String(variant.color || "").trim()).filter(Boolean).map((color) => [color.toLowerCase(), color])).values()];
  return (
    <a className={`product-card reveal ${listing ? "catalog-card" : ""}`} href={slugPath("shop", slug)}>
      <div className="product-media">
        {image ? <img src={image} alt={name} /> : <div className="media-placeholder">No image</div>}
        {hover && hover !== image && <img src={hover} alt={name} />}
        {item.isNew && <div className="tag tag-new">New</div>}
        {item.bestSeller && <div className="tag tag-best">Best seller</div>}
        {listing && <span className="quick-add">Choose options</span>}
      </div>
      <div className="product-info">
        {listing ? (
          <>
            <h3>{name}</h3>
            <small>{item.category || "EasternWestern New In"}</small>
            <div className="price-row"><span>Sale price</span><b>{formatPKR(price)}</b>{old && <s>Regular price {formatPKR(old)}</s>}</div>
          </>
        ) : (
          <>
            <h3>{name}</h3>
            <div><b>{formatPKR(price)}</b>{old && <s>{formatPKR(old)}</s>}</div>
          </>
        )}
      </div>
      {colors.length > 0 && <p className="card-colours"><span>Colour:</span> {colors.join(", ")}</p>}
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
      {items.length ? <div className="product-grid">{items.map((item) => <ProductCard key={item[1]} item={item} />)}</div> : <EmptyState title="New styles coming soon" text="Our available articles will appear here. Check back for new arrivals." />}
    </section>
  );
}

function EmptyState({ title, text }) {
  return <div className="empty-state reveal visible"><h3>{title}</h3><p>{text}</p></div>;
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

function CollectionsSection({ products = [] }) {
  const articles = products.slice(0, 3);
  return (
    <section id="collections" className="section collections">
      <div className="section-head reveal">
        <div><Kicker>Our Collections</Kicker><h2>Find a style for your wardrobe</h2></div>
        <Button dark href="/shop">Shop all items</Button>
      </div>
      {articles.map((item, i) => (
        <div className={`collection reveal ${i % 2 ? "flip" : ""}`} key={item.id || item[2]}>
          <div className="collection-copy">
            {(item.isNew || item.bestSeller) && <div className={"tag" + (item.bestSeller ? " collection-bestseller" : "")}>{item.bestSeller ? "Best seller" : "New"}</div>}
            <h4>{item.category}</h4><h3>{item[1]}</h3><p>{item[7]}</p>
            <strong>{formatPKR(item[3])}</strong>
            {priceAmount(item[4]) > priceAmount(item[3]) && <del>{formatPKR(item[4])}</del>}
            <Button dark href={slugPath("shop", item[2])}>View article</Button>
          </div>
          <a className="collection-img" href={slugPath("shop", item[2])} aria-label={`View ${item[1]}`}>
            {(item.media?.[3] || item[5]) ? <img src={item.media?.[3] || item[5]} alt={item[1]} loading="lazy" /> : <div className="media-placeholder">No image</div>}
          </a>
        </div>
      ))}
      {!articles.length && <EmptyState title="New styles coming soon" text="Visit again for the latest articles from Eastern Western." />}
    </section>
  );
}

function BlogList({ compact = false, posts: suppliedPosts, allPosts = blogs, content }) {
  const posts = suppliedPosts || (compact ? allPosts : allPosts.slice(0, 3));
  const section = { ...fallbackSiteData.content.sections.blogList, ...(content?.sections?.blogList || {}) };
  return (
    <section id={compact ? "blog-list" : "home-blog"} className={`section blog ${compact ? "blog-index" : ""}`}>
      {!compact && <div className="section-head reveal"><div><Kicker>{section.kicker}</Kicker><h2>{section.title}</h2></div><Button dark href="/blog">Read the journal</Button></div>}
      {posts.length ? <div className="blog-grid">{posts.map((b, i) => <a className={`blog-card reveal ${i === 0 ? "large" : ""}`} href={slugPath("blog", b[2])} key={b[1]}>{b[6] ? <img src={b[6]} alt="" /> : <div className="media-placeholder">No image</div>}<div><span>{b[0]}</span><h3>{b[1]}</h3>{(!compact || i === 0) && <p>{b[3]}</p>}<small>{b[4]} <b>{b[5]}</b></small></div></a>)}</div> : <EmptyState title="Stories coming soon" text="Visit again for style notes and updates from Eastern Western." />}
    </section>
  );
}

function Footer({ settings = fallbackSiteData.content.settings }) {
  const footerSettings = { ...fallbackSiteData.content.settings, ...settings };
  const chat = whatsappLink(footerSettings.contactPhone);
  return <footer id="footer">
    <div className="newsletter"><h3>Need help with<br />an article or order?</h3><a className="btn" href={chat} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></div>
    <div className="footer-grid">
      <div><a className="brand-logo footer-logo" href="/" aria-label="Eastern Western home"><img src={footerSettings.logoUrl || "/assets/easternwestern-logo.png"} alt="Eastern Western" /></a><p>{footerSettings.footerText}</p></div>
      <div><h4>Explore</h4><a href="/">Home</a><a href="/shop">Shop Women</a><a href="/bags">Bags — Coming soon</a><a href="/fragrance">Fragrance — Coming soon</a></div>
      <div className="footer-care"><h4>Customer Care</h4>{customerCareLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
      <div><h4>Get in touch</h4><a href={chat} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`mailto:${footerSettings.contactEmail}`}>{footerSettings.contactEmail}</a><a href={`tel:${footerSettings.contactPhone}`}>{footerSettings.contactPhone}</a><p>{footerSettings.contactAddress}</p></div>
    </div>
    <div className="footer-word">{footerSettings.brandName || "Eastern Western"}</div>
  </footer>;
}

function pageHero(content, key) {
  return { ...fallbackSiteData.content.pageHeroes[key], ...(content?.pageHeroes?.[key] || {}) };
}

const shopPickTabs = ["UNSTITCHED", "READY TO WEAR", "LUXURY PRET", "FREEDOM TO BUY", "MEN", "ACCESSORIES"];

function productGroups(products = []) {
  const category = (item) => String(item.category || "").trim().toUpperCase();
  return {
    "All Products": products,
    "UNSTITCHED": products.filter((item) => category(item).includes("UNSTITCHED")),
    "READY TO WEAR": products.filter((item) => category(item).includes("READY")),
    "LUXURY PRET": products.filter((item) => category(item).includes("LUXURY")),
    "FREEDOM TO BUY": products.filter((item) => category(item).includes("FABRIC")),
    "MEN": products.filter((item) => ["MEN", "MEN'S WEAR", "MENS WEAR"].includes(category(item))),
    "ACCESSORIES": products.filter((item) => category(item).includes("ACCESS")),
    "Sale": products.filter((item) => String(item[0] || "").includes("Save") || (item.tags || []).some((tag) => String(tag).includes("Save"))),
  };
}

function PickMarqueeRow({ items, reverse = false }) {
  const moving = items.length === 4;
  return (
    <div className={`pick-marquee${reverse ? " pick-marquee-reverse" : ""}${moving ? "" : " pick-marquee-static"}`} role="group" aria-label={reverse ? "Collection row 2" : "Collection row 1"}>
      <div className="pick-marquee-track">
        {(moving ? [0, 1] : [0]).map((copy) => (
          <div className="pick-marquee-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item) => (
              <a href={slugPath("shop", item[2])} className="pick-tile" key={item.id || item[2]} tabIndex={copy === 1 ? -1 : undefined}>
                <img src={item[5]} alt={copy === 1 ? "" : item[1]} loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PopularPicks({ products = [], active = "UNSTITCHED", onSelect }) {
  const [localActive, setLocalActive] = useState(active);
  const [paused, setPaused] = useState(false);
  const groups = productGroups(products);
  const requested = onSelect ? active : localActive;
  const selected = groups[requested]?.length ? requested : shopPickTabs.find((label) => groups[label].length) || "";
  const pickProducts = (groups[selected] || []).slice(0, 8);
  const choose = (label) => {
    if (onSelect) onSelect(label);
    else setLocalActive(label);
  };
  return (
    <section className={"popular-picks" + (onSelect ? " shop-picks" : "")}>
      <p>EXPLORE THE EASTERN WESTERN COLLECTION</p>
      <div className="pick-tabs">
        {shopPickTabs.map((label) => <button className={selected === label ? "active" : ""} disabled={!groups[label].length} onClick={() => choose(label)} key={label}>{label}{!groups[label].length && <small>Upcoming</small>}</button>)}
      </div>
      {pickProducts.length ? (
        <>
          {pickProducts.length >= 4 && (
            <div className="pick-slider-controls">
              <button type="button" className="pick-motion-control" aria-pressed={paused} aria-label={paused ? "Resume article sliders" : "Pause article sliders"} onClick={() => setPaused((value) => !value)}>
                <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "Play" : "Pause"}
              </button>
            </div>
          )}
          <div className="pick-marquees" data-paused={paused ? "true" : undefined} key={selected}>
            <PickMarqueeRow items={pickProducts.slice(0, 4)} />
            {pickProducts.length > 4 && <PickMarqueeRow items={pickProducts.slice(4, 8)} reverse />}
          </div>
        </>
      ) : <EmptyState title="New styles coming soon" text="Our available articles will appear here. Check back for new arrivals." />}
    </section>
  );
}

function HomePage({ data }) {
  const sourceSlides = data.content?.heroSlides?.length ? data.content.heroSlides : fallbackSiteData.content.heroSlides;
  const slides = compactHeroSlides(sourceSlides).filter(slide => slide.image || slide.mobileImage);
  const homeArrivals = data.products.filter((item) => item.isNew).slice(0, 9);
  const homeSellers = data.products.filter((item) => item.bestSeller).slice(0, 6);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = window.setTimeout(() => {
      setActiveSlide((activeSlide + 1) % slides.length);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [activeSlide, slides.length]);

  const slideIndex = Math.min(activeSlide, slides.length - 1);
  const activeHero = slides[slideIndex] || { label: "Arctic", image: hero };
  const about = { ...fallbackSiteData.content.sections.about, ...(data.content?.sections?.about || {}) };

  return (
    <>
      <section id="home-hero" className="hero">
        <HeroImage key={activeHero.image + "|" + (activeHero.mobileImage || "")} image={activeHero.image} mobileImage={activeHero.mobileImage} alt="Eastern Western clothing collection" />
        <div className="hero-overlay" />
        <div className="hero-season-copy">
          <h1>Winter '26</h1>
          <p>Live Now</p>
        </div>
        <div className="thumbs">{slides.map((slide, i) => <button className={i === slideIndex ? "active" : ""} onClick={() => setActiveSlide(i)} key={i} aria-label={`Show ${slide.label} collection`}><HeroImage image={slide.image} mobileImage={slide.mobileImage} /><span>{slide.label}</span></button>)}</div>
      </section>
      <PopularPicks products={data.products} />
      <Products id="new-arrivals" title="New Arrivals" subtitle="Discover our latest articles" items={homeArrivals} />
      <section id="about" className="about-hero">
        <video key={about.video || "default"} autoPlay muted loop playsInline preload="metadata" poster={about.video ? undefined : (about.poster || "/assets/story-poster.png")}><source src={about.video || "/assets/story.mp4"} type="video/mp4" /></video>
        <div className="hero-overlay" />
        <div className="about-copy reveal"><img src={about.logo || logo} alt="" /><p>{about.year}</p><h2>{about.title}</h2><p>{about.text}</p><div className="row"><Button href="/shop">Shop Women</Button><a className="btn btn-ghost" href={whatsappLink(data.content?.settings?.contactPhone)} target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div>
      </section>
      <Products id="best-sellers" title="Best sellers" subtitle="Explore more from Eastern Western" items={homeSellers} />
      <CollectionsSection content={data.content} products={data.products} />
      <FeaturesSection content={data.content} />
    </>
  );
}

function PageHero({ kicker, companion, title, text, image = hero, mobileImage = "", id = "page-hero", contactUrl = whatsappLink() }) {
  return (
    <section id={id} className="page-hero">
      <HeroImage image={image} mobileImage={mobileImage} />
      <div className="hero-overlay" />
      <div className="page-hero-copy reveal visible">
        <div className="hero-tag"><span>{kicker}</span><b>{companion}</b></div>
        <h1>{title}</h1><p>{text}</p>
        <div className="row"><Button href="/shop">Browse collections</Button><a className="btn btn-ghost" href={contactUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
      </div>
    </section>
  );
}

function AboutPage({ content }) {
  const heroContent = pageHero(content, "about");
  const aboutTrust = { ...fallbackSiteData.content.sections.aboutTrust, ...(content?.sections?.aboutTrust || {}) };
  const aboutStats = { ...fallbackSiteData.content.sections.aboutStats, ...(content?.sections?.aboutStats || {}) };
  const liveStats = Array.isArray(content?.statCards) && content.statCards.length ? content.statCards : fallbackSiteData.content.statCards;
  return (
    <>
      <PageHero {...heroContent} id="about-hero" />
      <section id="about-trust" className="section rating-strip reveal">
        <div className="rating-copy"><div><b>{aboutTrust.rating}</b><p>{aboutTrust.text}</p></div></div>
        <div><b>Prices in PKR</b><p>Cash on Delivery is currently available at checkout.</p></div>
      </section>
      <section id="about-stats" className="section about-stats">
        <div className="center-head reveal"><Kicker>{aboutStats.kicker}</Kicker><h2>{aboutStats.title}</h2></div>
        <div className="stats-grid">{liveStats.map((s) => <article className="stat-card reveal" key={s.value}><img src={s.image} alt="" /><div><h2>{s.value}</h2><p>{s.label}</p></div></article>)}</div>
      </section>
    </>
  );
}

function ShopPage({ products, content, contactUrl, search }) {
  const query = shopQuery(search);
  const [filter, setFilter] = useState(query.category || "UNSTITCHED");
  const [selected, setSelected] = useState({ prices: [], pieces: [], types: query.type ? [query.type] : [] });
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    if (query.category) setFilter(query.category);
    setSelected((current) => ({ ...current, types: query.type ? [query.type] : [] }));
  }, [query.category, query.type]);
  const heroContent = pageHero(content, "shop");
  const groups = productGroups(products);
  const selectedFilter = groups[filter]?.length ? filter : shopPickTabs.find((label) => groups[label].length) || "All Products";
  const view = (item) => ({ item, name: item[1], price: item[3], sku: item.sku, subcategory: item.subcategory, bestSeller: item.bestSeller });
  const currentProducts = sortProducts(filterProducts(groups[selectedFilter].map(view), selected), sort).map((entry) => entry.item);
  const toggle = (key, value) => setSelected((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
  const check = (key, value, label) => <label key={value}><input type="checkbox" checked={selected[key].includes(value)} onChange={() => toggle(key, value)} /> {label}</label>;
  const activeFilters = selected.prices.length + selected.pieces.length + selected.types.length;
  const filtered = activeFilters > 0;
  return (
    <>
      <PageHero {...heroContent} id="shop-hero" contactUrl={contactUrl} />
      <PopularPicks products={products} active={selectedFilter} onSelect={setFilter} />
      <section id="shop-listings" className="section catalog-section">
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div><b>{selectedFilter}</b><span>{currentProducts.length} products</span></div>
            <div className="catalog-controls">
              <button type="button" className="catalog-filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen((open) => !open)}>Filters{activeFilters ? ` (${activeFilters})` : ""}</button>
              <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}>{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </div>
          </div>
          {filtersOpen && <div id="catalog-filters" className="catalog-filters">
            <fieldset><legend>By Price</legend>{priceRanges.map((range) => check("prices", range.id, range.label))}</fieldset>
            <fieldset><legend>By Pieces</legend>{pieceOptions.map((count) => check("pieces", count, count === "1" ? "1 Piece" : count + " Pieces"))}</fieldset>
            <fieldset><legend>By Type</legend>{productSubcategories.map((type) => check("types", type, type))}</fieldset>
            {activeFilters ? <button type="button" className="catalog-clear" onClick={() => setSelected({ prices: [], pieces: [], types: [] })}>Clear filters</button> : null}
          </div>}
          {currentProducts.length ? <div className="product-grid listing-grid">{currentProducts.map((item) => <ProductCard key={item[1]} item={item} listing />)}</div> : <EmptyState title={filtered ? "No matching articles" : "New styles coming soon"} text={filtered ? "Try removing a filter to see more articles." : "Our available articles will appear here. Check back for new arrivals."} />}
        </div>
      </section>
    </>
  );
}

function ProductPage({ slug, products, onAddToCart, contactUrl }) {
  const sourceProducts = products;
  const existingProduct = sourceProducts.find((p) => p[2] === slug);
  const [loaded, setLoaded] = useState(null);
  const [loading, setLoading] = useState(!existingProduct);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (existingProduct) { setLoading(false); return; }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    loadProduct(slug, { signal: controller.signal })
      .then(product => { if (!controller.signal.aborted) setLoaded(product ? productDocToItem(product) : null); })
      .catch(() => { if (!controller.signal.aborted) setError("The product could not be loaded. Please try again."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [slug, existingProduct, retry]);
  const product = existingProduct || loaded;
  useEffect(() => { trackViewContent(product); }, [product]);
  if (!product && loading) return <section className="section article-load" role="status"><span className="work-loading-spinner" /><p>Loading article…</p></section>;
  if (!product && error) return <section className="section article-load" role="alert"><p>{error}</p><button className="btn btn-dark" onClick={() => setRetry(value => value + 1)}>Try again</button></section>;
  if (!product) return <><PageHero kicker="Shop" companion="No product" title="Product not found" text="Our available articles will appear here. Check back for new arrivals." image={hero} /></>;
  const relatedProducts = sourceProducts.filter((item) => item[2] !== product[2]).slice(0, 3);
  return (
    <>
      <ArticleDetails product={product} onAddToCart={onAddToCart} contactUrl={contactUrl} />
      <section className="section related-products">
        <div className="section-head reveal">
          <div><Kicker>More styles</Kicker><h2>You may also like</h2></div>
          <Button dark href="/shop">Shop all items</Button>
        </div>
        {relatedProducts.length ? <div className="product-grid">{relatedProducts.map((item) => <ProductCard key={item[1]} item={item} />)}</div> : <EmptyState title="More articles coming soon" text="Explore the shop for other available articles." />}
      </section>
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
    </>
  );
}

function BlogDetailPage({ slug, posts }) {
  const post = posts.find((b) => b[2] === slug) || posts[0];
  if (!post) return <><PageHero kicker="Blog" companion="No post" title="Blog not found" text="Visit again for style notes and updates from Eastern Western." image={hero} /></>;
  const bodyBlocks = String(post[7] || "").split(/\n+/).map((block) => block.trim()).filter(Boolean);
  return (
    <>
      <section className="article-hero">
        <img src={post[6]} alt="" />
        <div className="article-title reveal visible"><Kicker>{post[0]}</Kicker><h1>{post[1]}</h1><p>{post[3]}</p><small>{post[4]} - {post[5]}</small></div>
      </section>
      <article className="article-body reveal">
        {bodyBlocks.length ? bodyBlocks.map((block, index) => index === 0 ? <h2 key={block}>{block}</h2> : <p key={block}>{block}</p>) : <>
        <h2>Choose an article that suits your plans</h2>
        <p>Browse the photos and read the product description before ordering. Check the pieces included, available sizes and colour options for your chosen article.</p>
        <h2>Check the details</h2>
        <p>Fabric and care instructions can vary between articles. Contact Eastern Western with the product code if you need information that is not listed.</p>
        <h2>Ready to explore?</h2>
        <p>Visit the shop to see the available collection. Prices are in PKR and Cash on Delivery is currently available at checkout.</p>
        <a className="next-blog" href="/shop">Explore the collection <span>+</span></a>
        </>}
      </article>
    </>
  );
}

function ContactPage({ content }) {
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
          <img src={contactInfo.image} alt="Eastern Western style" />
          <ContactForm recipient={settings.contactEmail} />
        </div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return <section className="store-placeholder"><p>Eastern Western</p><h1>Page not found</h1><a className="store-placeholder-link" href="/shop">Shop Women</a></section>;
}

function ComingSoonPage({ category }) {
  return <section className="store-placeholder"><p className="store-placeholder-eyebrow">Eastern Western</p><h1>{category}</h1><span className="store-coming-label">Coming soon</span><p>A new collection is on its way. Stay close for the launch.</p><a className="store-placeholder-link" href="/shop">Shop Women <span aria-hidden="true">→</span></a></section>;
}

function RemovedPageRedirect() {
  useEffect(() => { window.location.replace("/shop"); }, []);
  return <section className="store-placeholder"><a href="/shop">Continue to Shop Women</a></section>;
}

function Router({ data, onAddToCart, cartItems, customerAccount, customerToken, onQty, onRemove, onOrderSuccess, onNeedLogin }) {
  const pathname = window.location.pathname;
  const contactUrl = whatsappLink(data.content?.settings?.contactPhone);
  const carePath = pathname.replace(/\/+$/, "") || "/";
  if (customerCarePages[carePath]) return <CustomerCarePage page={customerCarePages[carePath]} path={carePath} settings={data.content?.settings} contactUrl={contactUrl} onOpenAccount={onNeedLogin} customerAccount={customerAccount} />;
  if (removedStorePath.test(pathname)) return <RemovedPageRedirect />;
  if (pathname === "/bags" || pathname === "/fragrance") return <ComingSoonPage category={pathname === "/bags" ? "Bags" : "Fragrance"} />;
  if (pathname.startsWith("/admin")) return <AdminDashboard />;
  if (pathname === "/") return <HomePage data={data} />;
  if (pathname === "/shop") return <ShopPage products={data.products} content={data.content} contactUrl={contactUrl} search={window.location.search} />;
  if (pathname === "/checkout") return <CheckoutPage items={cartItems} customerAccount={customerAccount} customerToken={customerToken} onQty={onQty} onRemove={onRemove} onOrderSuccess={onOrderSuccess} onNeedLogin={onNeedLogin} contactUrl={contactUrl} />;
  if (pathname.startsWith("/shop/")) return <ProductPage slug={routeSlug(pathname)} products={data.products} onAddToCart={onAddToCart} contactUrl={contactUrl} />;
  return <NotFoundPage />;
}

function SiteLoadState({ error, onRetry }) {
  return (
    <main className="site-load-state" aria-busy={!error}>
      <p className="site-load-brand">EasternWestern</p>
      <div className="site-load-frame" aria-hidden="true" />
      <div className="site-load-message">
        <p role={error ? "alert" : "status"}>{error ? "We couldn't load the collection. Please try again." : "Loading our collection…"}</p>
        {error && <button type="button" onClick={onRetry}>Try again</button>}
      </div>
    </main>
  );
}

function App() {
  const route = useSiteRoute();
  const pathname = route.split(/[?#]/)[0];
  const darkHeader = pathname.startsWith("/shop/") || pathname === "/checkout";
  const isAdmin = pathname.startsWith("/admin");
  useEffect(() => { if (!isAdmin) trackPageView(route); }, [route, isAdmin]);
  const [siteData, setSiteData] = useState(null);
  const [siteLoadError, setSiteLoadError] = useState(false);
  const [siteLoadAttempt, setSiteLoadAttempt] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
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
  useEffect(() => {
    setSearchOpen(false);
    setCartOpen(false);
    setCustomerOpen(false);
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [route]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const addToCart = (product, quantity = 1, variant, option = 0, buyNow = false) => {
    const nextItem = { ...cartProduct(product), ...(variant ? { price: variant.price || product[3], image: variant.image || product[5], size: variant.size, color: variant.color, sku: variant.sku || product.sku } : {}), cartKey: variant ? `${product[2]}::${option}` : product[2] };
    setCartItems((items) => {
      const exists = items.find((item) => (item.cartKey || item.slug) === nextItem.cartKey);
      if (exists) return items.map((item) => (item.cartKey || item.slug) === nextItem.cartKey ? { ...item, qty: item.qty + quantity } : item);
      return [...items, { ...nextItem, qty: quantity }];
    });
    trackAddToCart(nextItem, quantity);
    if (buyNow) {
      setCartOpen(false);
      window.history.pushState(null, "", "/checkout");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else setCartOpen(true);
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
    setCartItems((items) => qty <= 0 ? items.filter((item) => (item.cartKey || item.slug) !== slug) : items.map((item) => (item.cartKey || item.slug) === slug ? { ...item, qty } : item));
  };
  const removeFromCart = (slug) => setCartItems((items) => items.filter((item) => (item.cartKey || item.slug) !== slug));
  useEffect(() => {
    if (isAdmin) return undefined;
    let active = true;
    const controller = new AbortController();
    setSiteLoadError(false);
    loadSiteData({ signal: controller.signal })
      .then((payload) => { if (active) setSiteData(normalizeSiteData(payload)); })
      .catch(() => { if (active) setSiteLoadError(true); });
    return () => {
      active = false;
      controller.abort();
    };
  }, [isAdmin, siteLoadAttempt]);
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
  }, [siteData, route]);
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
    const pageTitle = customerCarePages[pathname.replace(/\/+$/, "")]?.title || (pathname.startsWith("/shop/") ? "Article" : ({ "/shop": "Shop Women", "/bags": "Bags — Coming soon", "/fragrance": "Fragrance — Coming soon", "/checkout": "Checkout" })[pathname]);
    document.title = pageTitle ? `${pageTitle} | Eastern Western` : "Eastern Western | Pakistani Clothing";
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible"));
    }, { rootMargin: "420px 0px", threshold: 0.01 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  if (isAdmin) return <AdminDashboard />;
  if (!siteData) return <SiteLoadState error={siteLoadError} onRetry={() => setSiteLoadAttempt((attempt) => attempt + 1)} />;

  return (
    <main>
      <SaleBar settings={siteData.content?.settings || fallbackSiteData.content.settings} />
      <Header hasOffer={siteData.content?.settings?.offerEnabled !== false} scrolled={scrolled} cartCount={cartCount} customer={customerAccount} onSearch={() => setSearchOpen(true)} onCart={() => setCartOpen(true)} onAccount={() => setCustomerOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} products={siteData.products} />
      <CustomerPanel open={customerOpen} token={customerToken} customer={customerAccount} onClose={() => setCustomerOpen(false)} onAuth={saveCustomerAuth} onLogout={logoutCustomer} />
      <CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onQty={updateCartQty} onRemove={removeFromCart} />
      <Router key={pathname} data={siteData} onAddToCart={addToCart} cartItems={cartItems} customerAccount={customerAccount} customerToken={customerToken} onQty={updateCartQty} onRemove={removeFromCart} onOrderSuccess={() => setCartItems([])} onNeedLogin={() => setCustomerOpen(true)} />
      <Footer settings={siteData.content?.settings || fallbackSiteData.content.settings} />
      <WhatsAppButton href={whatsappLink(siteData.content?.settings?.contactPhone)} route={route} />
    </main>
  );
}

export default App;
