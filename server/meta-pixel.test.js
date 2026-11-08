import test from 'node:test';
import assert from 'node:assert/strict';

async function setup(hostname = 'easternwestern.pk') {
  const calls = [], scripts = [], saved = new Map();
  global.window = { location: { hostname, pathname: '/shop/afreen' }, fbq: (...args) => calls.push(args), sessionStorage: { getItem: key => saved.get(key), setItem: (key, val) => saved.set(key, val) } };
  global.document = { createElement: () => ({}), head: { appendChild: el => scripts.push(el) } };
  return { calls, scripts, pixel: await import('../src/meta-pixel.js?test=' + Math.random()) };
}

test('tracks visits and shopping with PKR values, without customer fields', async () => {
  const { calls, pixel } = await setup();
  pixel.trackPageView('/shop/afreen');
  pixel.trackPageView('/shop/afreen');
  const item = { slug: 'afreen', price: 'PKR 6,299', qty: 2, email: 'private@example.com', address: 'private address', name: 'Private Name' };
  pixel.trackCheckout([item]);
  pixel.trackAddToCart(item, 2);
  pixel.trackPurchase({ orderNo: 'EW-TEST', items: [item], subtotal: 12598, customer: item });
  pixel.trackPurchase({ orderNo: 'EW-TEST', items: [item], subtotal: 12598 });
  const events = calls.filter(call => call[0] === 'trackSingle');
  assert.deepEqual(events.map(call => call[2]), ['PageView', 'InitiateCheckout', 'AddToCart', 'Purchase']);
  assert.equal(events[3][3].value, 12598);
  assert.equal(events[3][3].currency, 'PKR');
  assert.equal(events[3][3].num_items, 2);
  assert.equal(JSON.stringify(calls).includes('private'), false);
  assert.equal(JSON.stringify(calls).includes('Private Name'), false);
  assert.equal(calls.filter(call => call[0] === 'init').length, 1);
});

test('does not send events from admin, preview hosts or incomplete orders', async () => {
  const { calls, pixel } = await setup('localhost');
  pixel.trackPageView('/shop');
  pixel.trackPurchase({ items: [], subtotal: 0 });
  assert.deepEqual(calls, []);
  window.location.hostname = 'easternwestern.pk';
  window.location.pathname = '/admin';
  pixel.trackCheckout([{ slug: 'x', price: 100 }]);
  assert.deepEqual(calls, []);
});

test('pixel blocking never breaks shopping', async () => {
  const { pixel } = await setup();
  window.fbq = () => { throw Error('blocked'); };
  assert.doesNotThrow(() => pixel.trackAddToCart({ slug: 'x', price: 100 }, 1));
  assert.doesNotThrow(() => pixel.trackPurchase({ orderNo: 'x', items: [{ slug: 'x', price: 100 }], subtotal: 100 }));
});
