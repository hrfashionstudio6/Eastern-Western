const brand = "Eastern Western";
const logo = "/assets/easternwestern-logo.png";

export const brandCopy = {
  settings: {
    brandName: brand, heroKicker: "Eastern", heroCompanion: "Western",
    heroTitle: "Pakistani style,\nyour way",
    heroText: "Explore clothing for everyday plans, family gatherings and your own sense of style.",
    offerText: "Eastern Western | Prices in PKR | Cash on Delivery",
    footerText: "Eastern Western is a Pakistani clothing brand. Explore our available articles, find your style and order with Cash on Delivery.",
  },
  pageHeroes: {
    about: { kicker: "Our brand", companion: brand, title: "Rooted in Pakistani style", text: "Eastern Western brings a Pakistani perspective to everyday dressing. Explore our articles and choose the colours, details and styles that feel like you." },
    shop: { kicker: "Shop", companion: "Explore our articles", title: "Find your next favourite outfit", text: "Browse the available collection. Check each article for its price in PKR, included pieces and available options before ordering." },
    blog: { kicker: "Style journal", companion: brand, title: "Ideas for your everyday style", text: "Outfit inspiration, clothing guides and updates from Eastern Western. New stories will appear here as they are published." },
    contact: { kicker: "Contact us", companion: "We're here to help", title: "Let's talk about your next outfit", text: "Ask about an article, available options or an existing order. Share the product code or order number so we can understand your enquiry." },
  },
  sections: {
    about: { year: "Eastern Western", title: "Pakistani clothing, personal style", text: "From everyday dressing to family get-togethers, clothing is part of how we express ourselves. Eastern Western brings together articles for customers who enjoy Pakistani style with a fresh perspective. Explore what is available and choose an outfit that suits your plans." },
    aboutTrust: { rating: "Made for your wardrobe", text: "Explore the articles. Check the details. Choose your style." },
    aboutStats: { kicker: "The Eastern Western approach", title: "Your style starts with the details. Browse our collection, check the article information and ask us whenever you need help choosing." },
    review: { kicker: "Before you order", title: "A little guidance for your next outfit", text: "Check the article details, available options and payment method before placing your order.", rating: "", summary: "", quote: "", name: brand, role: "Shopping guide", image: logo },
    features: { kicker: "Explore your style", title: "Details that help you choose", text: "Start with the occasion, look through the article photos and choose from the options listed for each product." },
    blogList: { kicker: "Eastern Western journal", title: "Style notes and brand updates" },
    social: { kicker: "Keep exploring", title: "Discover your next\nEastern Western look", text: "Browse our available articles or contact us with a product code if you would like more information." },
  },
  reviewItems: [
    { rating: "", summary: "Choose your article", quote: "Look through the product photos and read what is included. Different articles may include different pieces, so check the description before ordering.", name: brand, role: "Article guide", image: logo },
    { rating: "", summary: "Check the options", quote: "Check the sizes, colours, fabric details and stock listed for your chosen article. If a detail is missing, contact us before placing your order.", name: brand, role: "Choosing your outfit", image: logo },
    { rating: "", summary: "Place your order", quote: "Prices are shown in Pakistani rupees. Cash on Delivery is currently available at checkout. Enter your complete address and a reachable phone number.", name: brand, role: "Ordering guide", image: logo },
  ],
  featureCards: [
    { title: "Everyday outfits", text: "Choose an article that works for your daily plans and personal style.", tags: ["Everyday", "Your style", "Outfit ideas"] },
    { title: "Colours and details", text: "Look through the photos to explore each article's colours, print and design details.", tags: ["Colours", "Design", "Photos"] },
    { title: "Pieces included", text: "Read the description to check whether the article includes a shirt, trousers, dupatta or other pieces.", tags: ["Shirt", "Trousers", "Dupatta"] },
    { title: "Available options", text: "Check the sizes and colours listed on the product page before choosing your article.", tags: ["Sizes", "Colours", "Availability"] },
    { title: "Article information", text: "Check fabric and care information for your chosen article. Ask us if you need more details.", tags: ["Fabric", "Care", "Ask us"] },
    { title: "Order with clarity", text: "Review your cart, price in PKR and delivery details before placing your Cash on Delivery order.", tags: ["PKR", "Cash on Delivery", "Order details"] },
  ],
  statCards: [
    { value: "Style", label: "Explore Pakistani clothing" },
    { value: "Details", label: "Check each article before ordering" },
    { value: "PKR", label: "Prices in Pakistani rupees" },
    { value: "COD", label: "Cash on Delivery at checkout" },
  ],
  collections: [
    { tag: "Explore", name: "Unstitched", title: "Style it your way", text: "Explore unstitched articles when available. Check the description for fabric details, included pieces and measurements.", price: "", oldPrice: "" },
    { tag: "Explore", name: "Ready to Wear", title: "Choose your next outfit", text: "Browse ready-to-wear articles and check the available sizes, colours and included pieces before ordering.", price: "", oldPrice: "" },
    { tag: "Explore", name: "Fabric", title: "Start with the fabric", text: "Explore fabric options when available. Ask us about any material or measurement details that are not listed.", price: "", oldPrice: "" },
  ],
};

export function localizeBrandContent(content = {}) {
  const mergeBlocks = (existing = {}, patches = {}) => Object.fromEntries([...new Set([...Object.keys(existing), ...Object.keys(patches)])].map(key => [key, { ...(existing[key] || {}), ...(patches[key] || {}) }]));
  const mergeCards = (existing = [], patches = []) => patches.map((patch, index) => ({ ...(existing[index] || {}), ...patch }));
  const settings = { ...(content.settings || {}), ...brandCopy.settings };
  if (!settings.contactEmail || settings.contactEmail === "test@gmail.com") settings.contactEmail = "help@easternwestern.net";
  if (!settings.contactPhone || settings.contactPhone === "+001 234 567 890") settings.contactPhone = "+923035721398";
  if (!settings.contactAddress || settings.contactAddress === "England, London") settings.contactAddress = "Pakistan";
  const labels = ["Everyday", "New season", "Style edit", "Seasonal", "Casual", "Classic", "Details"];
  return { ...content, brandCopyVersion: 1, settings,
    pageHeroes: mergeBlocks(content.pageHeroes, brandCopy.pageHeroes),
    sections: mergeBlocks(content.sections, brandCopy.sections),
    reviewItems: brandCopy.reviewItems,
    featureCards: mergeCards(content.featureCards, brandCopy.featureCards),
    statCards: mergeCards(content.statCards, brandCopy.statCards),
    collections: mergeCards(content.collections, brandCopy.collections),
    heroSlides: (content.heroSlides || []).map((slide, index) => ({ ...slide, label: labels[index] || "Collection" })),
  };
}

