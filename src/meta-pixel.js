import { priceAmount } from '../shared/money.js';

export const META_PIXEL_ID = '1474568307934174';
const storeHosts = new Set(['easternwestern.pk', 'www.easternwestern.pk', 'easternwestern.net', 'www.easternwestern.net']);
let initialized = false;
let lastPage = '';
let lastContent = '';
const purchases = new Set();

function pixel() {
  if (typeof window === 'undefined' || !storeHosts.has(window.location.hostname) || window.location.pathname.startsWith('/admin')) return null;
  try {
    if (!initialized) {
      if (!window.fbq) {
        const queue = function (...args) {
          if (queue.callMethod) queue.callMethod(...args);
          else queue.queue.push(args);
        };
        queue.push = queue;
        queue.loaded = true;
        queue.version = '2.0';
        queue.queue = [];
        window.fbq = queue;
        window._fbq = queue;
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);
      }
      // Send only the explicit commerce fields below; do not infer customer details.
      window.fbq('set', 'autoConfig', false, META_PIXEL_ID);
      window.fbq('init', META_PIXEL_ID);
      initialized = true;
    }
    return window.fbq;
  } catch { return null; }
}

function send(event, data = {}, options) {
  try {
    const fbq = pixel();
    if (!fbq) return false;
    fbq('trackSingle', META_PIXEL_ID, event, data, ...(options ? [options] : []));
    return true;
  } catch { return false; } // Analytics must never block shopping or order confirmation.
}

export function commerceData(items = []) {
  const contents = items.map(item => ({ id: String(item.slug || item.id || ''), quantity: Number(item.qty) || 1, item_price: priceAmount(item.price) })).filter(item => item.id);
  return {
    content_type: 'product', content_ids: contents.map(item => item.id), contents,
    num_items: contents.reduce((sum, item) => sum + item.quantity, 0),
    value: contents.reduce((sum, item) => sum + item.item_price * item.quantity, 0), currency: 'PKR',
  };
}

export function trackPageView(route) {
  const path = String(route).split(/[?#]/)[0];
  if (path === lastPage || path.startsWith('/admin')) return;
  if (send('PageView')) { lastPage = path; lastContent = ''; }
}

export function trackViewContent(product) {
  if (!product) return;
  if (typeof window !== 'undefined') trackPageView(window.location.pathname);
  if (lastContent === product[2]) return;
  if (send('ViewContent', commerceData([{ slug: product[2], price: product[3], qty: 1 }]))) lastContent = product[2];
}

export function trackAddToCart(item, quantity) {
  send('AddToCart', commerceData([{ ...item, qty: quantity }]));
}

export function trackCheckout(items) {
  if (typeof window !== 'undefined') trackPageView(window.location.pathname);
  if (items.length) send('InitiateCheckout', commerceData(items));
}

export function trackPurchase(order) {
  if (!order?.orderNo || !Array.isArray(order.items)) return;
  const id = String(order.orderNo);
  if (purchases.has(id)) return;
  try { if (window.sessionStorage.getItem('ew-meta-purchase:' + id)) return; } catch { /* Storage may be disabled. */ }
  const data = commerceData(order.items);
  data.value = priceAmount(order.subtotal);
  // Called only after the server confirms a saved order, using server-priced items.
  if (send('Purchase', data, { eventID: 'purchase:' + id })) {
    purchases.add(id);
    try { window.sessionStorage.setItem('ew-meta-purchase:' + id, '1'); } catch { /* Keep in-memory deduplication. */ }
  }
}
