import { useEffect, useState } from "react";
import "./index.css";

const logo = "/assets/01.svg";
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

function Button({ children, dark = false, ghost = false, href = "/shop" }) {
  return <a className={`btn ${dark ? "btn-dark" : ""} ${ghost ? "btn-ghost" : ""}`} href={href}><span>{children}</span><span>{children}</span></a>;
}

function Kicker({ children }) {
  return <div className="kicker"><span />{children}</div>;
}

function Header({ dark = false, scrolled = false, cartCount = 0, onSearch, onCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["Home", "/"], ["About", "/about"], ["Shop", "/shop"], ["Blog", "/blog"], ["Contact", "/contact"]];

  useEffect(() => {
    document.body.classList.toggle("menu-active", menuOpen);
    return () => document.body.classList.remove("menu-active");
  }, [menuOpen]);

  return (
    <nav className={`nav ${dark ? "nav-dark" : ""} ${scrolled ? "nav-scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <a className="brand-logo nav-logo" href="/" aria-label="EasternWestern home"><img src="/assets/easternwestern-logo.png" alt="EasternWestern" /></a>
      <div className="nav-links">{links.map(([label, href]) => <a href={href} key={label}><span>{label}</span><span>{label}</span></a>)}</div>
      <div className="nav-actions">
        <button className="search-button" aria-label="Search Icon" onClick={onSearch}><span /></button>
        <button className="cart-button" aria-label={`Open cart, ${cartCount} items`} onClick={onCart}><i /><b>{cartCount}</b></button>
        <Button dark={dark} href="/shop">Shop all items</Button>
        <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
      </div>
    </nav>
  );
}

function CartDrawer({ open, items, onClose, onQty, onRemove }) {
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + priceValue(item.price) * item.qty, 0);
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
            <div className="cart-total"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
            <a className="cart-checkout" href="/contact">Checkout</a>
          </>
        )}
      </aside>
    </div>
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

function SaleBar() {
  return <div className="sale"><div>{Array(12).fill("Black friday sale 50% off").map((x, i) => <span key={i}>{x}</span>)}</div></div>;
}

function ProductCard({ item }) {
  const [tag, name, slug, price, old, image, hover] = item;
  return (
    <a className="product-card reveal" href={slugPath("shop", slug)}>
      <div className="product-media">
        <img src={image} alt={name} />
        <img src={hover} alt={name} />
        <div className="tag">{tag}</div>
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <div><b>{price}</b><s>{old}</s></div>
      </div>
      <div className="swatches"><i /><i /><i /></div>
    </a>
  );
}

function Products({ title, subtitle, items = allProducts }) {
  const sectionClass = title === "New Arrivals" ? "products-new" : title === "Best sellers" ? "products-best" : "";
  return (
    <section id="shop" className={`section products ${sectionClass}`}>
      <div className="section-head reveal">
        <div><Kicker>{title}</Kicker><h2>{subtitle}</h2></div>
        <Button dark href="/shop">See all collections</Button>
      </div>
      <div className="product-grid">{items.map((item) => <ProductCard key={item[1]} item={item} />)}</div>
    </section>
  );
}

function ReviewSection() {
  return (
    <section className="section review">
      <div className="center-head reveal"><Kicker>Customer reviews</Kicker><h2>The voice of quality</h2><p>Experience the difference through the words of customers who value premium fabrics and timeless design.</p></div>
      <div className="review-card reveal">
        <div className="stars">5.0/5 <span>4.9 from 1k+ reviews</span></div>
        <p>The premium quality of the men's collection is truly unmatched lately. The fabrics feel incredibly premium and soft. This specific tailored fit is perfect for my busy office. A very sharp look. I love it every day.</p>
        <div className="person"><img src="/assets/51.png" alt="" /><div><b>James Carter</b><span>Creative Director</span></div></div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="section features">
      <div className="center-head reveal"><Kicker>What defines our wear</Kicker><h2>Where style meets ease</h2><p>Thoughtful design blending modern style, comfort, and versatility for everyday living across lifestyles.</p></div>
      <div className="feature-grid">{features.map((f, i) => <article className="feature reveal" key={f[0]}><img src={socials[i + 2]} alt="" /><h3>{f[0]}</h3><p>{f[1]}</p><div>{f[2].map((x) => <span key={x}>{x}</span>)}</div></article>)}</div>
    </section>
  );
}

function CollectionsSection() {
  return (
    <section className="section collections">
      <div className="section-head reveal">
        <div><Kicker>Our Collections</Kicker><h2>Modern collections defined by simplicity</h2></div>
        <Button dark href="/shop">Shop all items</Button>
      </div>
      {collections.map((c, i) => (
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

function BlogList({ compact = false, posts: suppliedPosts }) {
  const posts = suppliedPosts || (compact ? blogs : blogs.slice(0, 3));
  return (
    <section id="blog" className={`section blog ${compact ? "blog-index" : ""}`}>
      {!compact && <div className="section-head reveal"><div><Kicker>Wearix Voice</Kicker><h2>Elevating your daily style journey</h2></div><Button dark href="/blog">Read all blogs</Button></div>}
      <div className="blog-grid">{posts.map((b, i) => <a className={`blog-card reveal ${i === 0 ? "large" : ""}`} href={slugPath("blog", b[2])} key={b[1]}><img src={b[6]} alt="" /><div><span>{b[0]}</span><h3>{b[1]}</h3>{(!compact || i === 0) && <p>{b[3]}</p>}<small>{b[4]} <b>{b[5]}</b></small></div></a>)}</div>
    </section>
  );
}

function SocialSection() {
  return (
    <section id="contact" className="social-section">
      <div className="center-head reveal"><Kicker>Stay connected</Kicker><h2>See our community<br />in modern silhouettes</h2><p>Connect with us on social media for a daily dose of fresh style, featuring exclusive looks from our community.</p><div className="row"><Button dark href="/shop">See collections</Button><Button href="/contact">Contact us</Button></div></div>
      <div className="social-collage">{routeSocials.map((src, i) => <img src={src} key={i} alt="" />)}</div>
    </section>
  );
}

function Footer() {
  const socialLinks = [["Instagram", "https://instagram.com/"], ["Dribbble", "https://dribbble.com/"], ["Facebook", "https://facebook.com/"], ["Twitter", "https://x.com/"], ["Youtube", "https://youtube.com/"]];
  return (
    <footer>
      <div className="newsletter"><h3>Subscribe to<br />our news later</h3><form><input placeholder="Enter email" /><button>Subscribe</button></form></div>
      <div className="footer-grid">
        <div><a className="brand-logo footer-logo" href="/" aria-label="EasternWestern home"><img src="/assets/easternwestern-logo.png" alt="EasternWestern" /></a><p>A sophisticated e-commerce template designed for modern and minimalist brands.</p><Button href="/contact">Contact EasternWestern</Button></div>
        <div><h4>Quick Links</h4>{[["Home", "/"], ["About", "/about"], ["Blog", "/blog"], ["Shop", "/shop"], ["Reviews", "/about"], ["Styles", "/blog"]].map(([x, href]) => <a href={href} key={x}>{x}</a>)}</div>
        <div><h4>Follow us:</h4>{socialLinks.map(([label, href]) => <a href={href} key={label} target="_blank" rel="noreferrer">{label}</a>)}</div>
        <div><h4>Get in touch</h4><a href="mailto:test@gmail.com">test@gmail.com</a><a href="tel:+001234567890">+001 234 567 890</a><a href="https://maps.google.com/?q=London,England" target="_blank" rel="noreferrer">London, England</a></div>
      </div>
      <div className="footer-word">EasternWestern</div>
    </footer>
  );
}

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(3);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveSlide((activeSlide + 1) % heroSlides.length);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [activeSlide]);

  return (
    <>
      <section className="hero">
        <img key={heroSlides[activeSlide][1]} src={heroSlides[activeSlide][1]} alt="Modern black leather outfit" />
        <div className="hero-overlay" />
        <div className="hero-copy reveal visible">
          <div className="hero-tag"><span>Soft</span><b>Warm Winter Layers</b></div>
          <h1>Premium wear<br />for modern living</h1>
          <p>Discover our new range of soft clothes made for your daily look and your best days with the finest fabrics.</p>
          <div className="row"><Button href="/shop">See all collections</Button><Button ghost href="/contact">Contact us</Button></div>
        </div>
        <div className="thumbs">{heroSlides.map(([label, src], i) => <button className={i === activeSlide ? "active" : ""} onClick={() => setActiveSlide(i)} key={label} aria-label={`Show ${label} collection`}><img src={src} alt="" /><span>{label}</span></button>)}</div>
      </section>
      <div className="word-marquee"><div>{["Urban", "Latest", "Premium", "Arctic", "Casual", "Iconic", "Unique", "Urban", "Latest"].map((x, i) => <span key={i}>{x}</span>)}</div></div>
      <Products title="New Arrivals" subtitle="Fresh fits in our latest drop" items={arrivals} />
      <section id="about" className="about-hero">
        <video autoPlay muted loop playsInline poster="/assets/story-poster.png"><source src="/assets/story.mp4" type="video/mp4" /></video>
        <div className="hero-overlay" />
        <div className="about-copy reveal"><img src={logo} alt="" /><p>Since 2014</p><h2>Defining modern style</h2><p>A decade ago, we set out to redefine the modern silhouette. Today, we merge urban utility with high-end aesthetics in a resilient, beautiful collection.</p><div className="row"><Button href="/about">More about us</Button><Button ghost href="/contact">Contact us</Button></div></div>
      </section>
      <Products title="Best sellers" subtitle="Our signature best selling pieces" items={sellers} />
      <CollectionsSection />
      <ReviewSection />
      <FeaturesSection />
      <BlogList />
      <SocialSection />
    </>
  );
}

function PageHero({ kicker, companion, title, text, image = hero }) {
  return (
    <section className="page-hero">
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

function AboutPage() {
  return (
    <>
      <PageHero kicker="About" companion="Know about Wearix" title="Timeless design, modern wearability" text="We focus on creating essential garments that remain relevant, functional, and refined across seasons." image="/assets/53.png" />
      <section className="section rating-strip reveal">
        <div className="rating-copy"><div className="avatar-stack">{["/assets/54.png", "/assets/55.png", "/assets/56.png", "/assets/57.png", "/assets/58.png"].map((src) => <img src={src} key={src} alt="" />)}</div><div><b>4.9/5 rating</b><p>Trusted by 1k+ businesses</p></div></div>
        <div className="brand-marquee"><div>{[59, 60, 61, 62, 63, 59, 63, 61].map((n, i) => <img src={`/assets/${n}.svg`} key={`${n}-${i}`} alt="" />)}</div></div>
      </section>
      <section className="section about-stats">
        <div className="center-head reveal"><Kicker>About Wearix</Kicker><h2>More than fashion, Wearix is a commitment to intentional design. Our curated collections focus on sleek silhouettes, empowering your unique and personal journey with modern ease.</h2></div>
        <div className="stats-grid">{statCards.map((s) => <article className="stat-card reveal" key={s[0]}><img src={s[2]} alt="" /><div><h2>{s[0]}</h2><p>{s[1]}</p></div></article>)}</div>
      </section>
      <SocialSection />
    </>
  );
}

function ShopPage() {
  const [filter, setFilter] = useState("All Products");
  const groups = {
    "All Products": shopProducts,
    "Men's Wear": shopProducts.filter((_, i) => [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 13].includes(i)),
    "Women's Wear": shopProducts.filter((_, i) => [14, 15, 16, 17, 18, 19].includes(i)),
    "Children's Wear": shopProducts.filter((_, i) => [3, 5, 13].includes(i)),
  };
  return (
    <>
      <PageHero kicker="Shop" companion="The new season" title="Elevate your daily wardrobe with ease" text="Explore our handpicked modern silhouettes crafted from the world's most sustainable fabrics." image="/assets/126.png" />
      <section className="section shop-filter reveal">{Object.keys(groups).map((label) => <button className={filter === label ? "active" : ""} onClick={() => setFilter(label)} key={label}>{label}</button>)}</section>
      <section className="section shop-products"><div className="product-grid">{groups[filter].map((item) => <ProductCard key={item[1]} item={item} />)}</div></section>
      <SocialSection />
    </>
  );
}

function ProductPage({ slug, onAddToCart }) {
  const product = allProducts.find((p) => p[2] === slug) || allProducts[0];
  const relatedProducts = allProducts.filter((item) => item[2] !== product[2]).slice(0, 3);
  const gallery = slug === "textured-knitted-shirt" ? [product[5], product[6], "/assets/123.jpg", "/assets/124.jpg", "/assets/125.png"] : [product[5], product[6]];
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const specs = [["Material", "Premium organic cotton textured knit"], ["Care", "Machine wash cold, lay flat"], ["Warranty", "One year full quality guarantee"]];
  const trust = [["Trusted Quality", "Every piece is checked to ensure it meets our standards."], ["Real Time Tracking", "Get live updates from our warehouse to your doorstep."], ["Secure Payments", "Shop confidently with our secure, encrypted checkout."], ["Easy Returns", "Change your mind? Return any item easily within thirty days."]];
  return (
    <>
      <section className="section product-detail">
        <div className="product-main reveal">
          <div className="tag">{product[0]}</div>
          <img src={activeImage} alt={product[1]} />
          <div className="product-thumbnails">{gallery.map((src, i) => <button className={src === activeImage ? "active" : ""} onClick={() => setActiveImage(src)} key={`${src}-${i}`} aria-label={`View ${product[1]} image ${i + 1}`}><img src={src} alt="" /></button>)}</div>
        </div>
        <div className="product-panel reveal">
          <div className="breadcrumbs"><b>Shop</b><span />Men's Wear</div>
          <h1>{product[1]}</h1>
          <div className="detail-price"><b>USD {product[3]}</b><s>USD {product[4]}</s></div>
          <p>{slug === "textured-knitted-shirt" ? "A premium knit construction offering a refined silhouette and breathable comfort for sophisticated everyday summer styling." : product[7]}</p>
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
        <div className="product-grid">{relatedProducts.map((item) => <ProductCard key={item[1]} item={item} />)}</div>
      </section>
      <SocialSection />
    </>
  );
}

function BlogPage() {
  const [filter, setFilter] = useState("All Blogs");
  const filtered = filter === "All Blogs" ? blogs : blogs.filter((post) => post[0] === filter);
  return (
    <>
      <PageHero kicker="Blog" companion="Read our stories" title="The craft behind every single stitch" text="Discover the detailed process of creating premium garments from our sustainable materials." image="/assets/81.jpeg" />
      <section className="section shop-filter reveal">{["All Blogs", "Style Guide", "Fashion Tips", "Brand Stories"].map((label) => <button className={filter === label ? "active" : ""} onClick={() => setFilter(label)} key={label}>{label}</button>)}</section>
      <BlogList compact posts={filtered} />
      <SocialSection />
    </>
  );
}

function BlogDetailPage({ slug }) {
  const post = blogs.find((b) => b[2] === slug) || blogs[0];
  return (
    <>
      <section className="article-hero">
        <img src={post[6]} alt="" />
        <div className="article-title reveal visible"><Kicker>{post[0]}</Kicker><h1>{post[1]}</h1><p>{post[3]}</p><small>{post[4]} - {post[5]}</small></div>
      </section>
      <article className="article-body reveal">
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
      </article>
      <SocialSection />
    </>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero kicker="Contact" companion="Here to help you" title="Helping you define your personal style" text="Contact us today for refined service designed for our discerning Wearix fashion community." image="/assets/88.png" />
      <section className="section contact-layout">
        <div className="contact-cards reveal">
          {[["/assets/89.svg", "test@gmail.com", "Email Address"], ["/assets/90.svg", "+001 234 567 890", "Phone Number"], ["/assets/91.svg", "England, London", "Location"]].map(([icon, value, label]) => <article key={label}><img src={icon} alt="" /><b>{value}</b><span>{label}</span></article>)}
        </div>
        <div className="contact-main reveal">
          <img src="/assets/92.png" alt="Woman in blue modern outfit" />
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            <label>First Name<input required placeholder="Nasir" /></label><label>Last Name<input required placeholder="Nawaz" /></label>
            <label>Email<input type="email" required placeholder="test@gmail.com" /></label><label>Phone No<input placeholder="+123 456 789 00" /></label>
            <label className="wide">Subject<input required placeholder="Enquiry ...." /></label><label className="wide">Message<textarea required placeholder="Enter message here..." /></label>
            <button className="wide" type="submit">{sent ? "Message Sent" : "Send Message"}</button>
          </form>
        </div>
      </section>
      <SocialSection />
    </>
  );
}

function NotFoundPage() {
  return <PageHero kicker="404" title="Page not found" text="This route is not part of the Wearix clone." image={hero} />;
}

function Router({ onAddToCart }) {
  const pathname = window.location.pathname;
  if (pathname === "/") return <HomePage />;
  if (pathname === "/about") return <AboutPage />;
  if (pathname === "/shop") return <ShopPage />;
  if (pathname === "/blog") return <BlogPage />;
  if (pathname === "/contact") return <ContactPage />;
  if (pathname.startsWith("/shop/")) return <ProductPage slug={pathname.split("/").pop()} onAddToCart={onAddToCart} />;
  if (pathname.startsWith("/blog/")) return <BlogDetailPage slug={pathname.split("/").pop()} />;
  return <NotFoundPage />;
}

function App() {
  const pathname = window.location.pathname;
  const darkHeader = pathname.startsWith("/shop/");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
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
  const updateCartQty = (slug, qty) => {
    setCartItems((items) => qty <= 0 ? items.filter((item) => item.slug !== slug) : items.map((item) => item.slug === slug ? { ...item, qty } : item));
  };
  const removeFromCart = (slug) => setCartItems((items) => items.filter((item) => item.slug !== slug));
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
    document.title = "Wearix - Modern Clothing E-commerce Framer Template";
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible"));
    }, { rootMargin: "420px 0px", threshold: 0.01 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  return (
    <main>
      <SaleBar />
      <Header dark={darkHeader} scrolled={scrolled} cartCount={cartCount} onSearch={() => setSearchOpen(true)} onCart={() => setCartOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onQty={updateCartQty} onRemove={removeFromCart} />
      <Router onAddToCart={addToCart} />
      <Footer />
    </main>
  );
}

export default App;
