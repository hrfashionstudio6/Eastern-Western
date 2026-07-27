const { chromium } = require("playwright");
const path = require("path");

const executablePath = path.join(process.env.LOCALAPPDATA, "ms-playwright", "chromium-1228", "chrome-win64", "chrome.exe");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const out = {};

  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await page.hover(".hero .btn");
  out.buttonHover = await page.locator(".hero .btn span").first().evaluate((el) => getComputedStyle(el).transform);
  await page.hover(".product-card");
  await page.waitForTimeout(500);
  out.productHover = await page.locator(".product-card .product-media img").nth(1).evaluate((el) => ({
    opacity: getComputedStyle(el).opacity,
    transform: getComputedStyle(el).transform,
  }));
  await page.click("[aria-label='Search Icon']");
  out.searchOpen = await page.locator(".search-overlay input[placeholder='Search...']").count();
  await page.click("[aria-label='Close search']");
  out.searchClosed = await page.locator(".search-overlay").count();

  await page.goto("http://127.0.0.1:5173/blog", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Style Guide" }).click();
  out.blogFilterCards = await page.locator(".blog-card").count();

  await page.goto("http://127.0.0.1:5173/shop", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Women's Wear" }).click();
  out.shopFilterCards = await page.locator(".product-card").count();

  await page.goto("http://127.0.0.1:5173/shop/textured-knitted-shirt", { waitUntil: "networkidle" });
  const before = await page.locator(".product-main > img").getAttribute("src");
  await page.locator(".product-thumbnails button").nth(1).click();
  const after = await page.locator(".product-main > img").getAttribute("src");
  out.thumbnailChanged = before !== after;
  await page.getByRole("button", { name: "Add to cart Added to cart" }).click();
  out.cartOpenedFromProduct = await page.locator(".cart-shell.open").count();
  out.cartBadgeAfterAdd = await page.locator(".cart-button b").innerText();
  await page.getByRole("button", { name: "Increase Textured Knitted Shirt" }).click();
  out.cartQtyAfterIncrease = await page.locator(".qty-row span").innerText();
  await page.getByRole("button", { name: "Close cart" }).click();
  out.cartClosed = await page.locator(".cart-shell.open").count();
  await page.getByRole("button", { name: "Open cart, 2 items" }).click();
  out.cartReopenedFromNavbar = await page.locator(".cart-shell.open").count();
  await page.getByRole("button", { name: "Remove Textured Knitted Shirt" }).click();
  out.cartEmptyVisible = await page.locator("text=Your cart is empty").count();
  await page.getByRole("button", { name: "Close cart" }).click();
  out.relatedTitle = await page.locator(".related-products h2").innerText();
  out.relatedCards = await page.locator(".related-products .product-card").count();
  await page.locator(".related-products .product-card").first().click();
  await page.waitForLoadState("networkidle");
  out.relatedNavigation = page.url().includes("/shop/") && !page.url().endsWith("/textured-knitted-shirt");

  await page.goto("http://127.0.0.1:5173/contact", { waitUntil: "networkidle" });
  await page.fill("input[placeholder='Nasir']", "Ali");
  await page.fill("input[placeholder='Nawaz']", "Khan");
  await page.fill("input[type='email']", "a@test.com");
  await page.fill("input[placeholder='Enquiry ....']", "Hello");
  await page.fill("textarea", "Message");
  await page.getByRole("button", { name: "Send Message" }).click();
  out.contactSent = await page.getByRole("button", { name: "Message Sent" }).count();

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
