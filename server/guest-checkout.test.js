import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

test('guest order API saves an order without login/email at the saved article price', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'ew-guest-checkout-'));
  let server;
  try {
    await fs.cp(path.join(root, 'server'), path.join(temp, 'server'), { recursive: true });
    await fs.cp(path.join(root, 'shared'), path.join(temp, 'shared'), { recursive: true });
    await fs.symlink(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
    await fs.writeFile(path.join(temp, 'package.json'), '{"type":"module"}');
    await fs.mkdir(path.join(temp, 'data'));
    await fs.writeFile(path.join(temp, 'data/local-store.json'), JSON.stringify({ products: [{ slug: 'test-suit', name: 'Test suit', status: 'published', price: 'PKR 6299' }], orders: [], customers: [] }));
    process.env.NODE_ENV = 'test';
    const { app } = await import(pathToFileURL(path.join(temp, 'server/server.js')));
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/orders`;
    const body = { customer: { name: 'Test Buyer', phone: '03001234567', address: 'Test street, Lahore' }, items: [{ slug: 'test-suit', price: 1, qty: 2 }], paymentMethod: 'Cash on Delivery' };
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    assert.equal(response.status, 201);
    assert.equal(data.order.customerId, '');
    assert.equal(data.order.customer.email, '');
    assert.equal(data.order.subtotal, 12598);
    assert.ok(data.order.orderNo);
    const store = JSON.parse(await fs.readFile(path.join(temp, 'data/local-store.json')));
    assert.equal(store.orders.length, 1);
    const invalid = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, customer: { ...body.customer, phone: 'abc' } }) });
    assert.equal(invalid.status, 400);
    assert.equal(JSON.parse(await fs.readFile(path.join(temp, 'data/local-store.json'))).orders.length, 1);
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await fs.rm(temp, { recursive: true, force: true });
  }
});
