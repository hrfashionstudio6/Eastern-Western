import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import mysql from "mysql2/promise";
import { connectionOptions, initializeSchema, createRepository, closeDb, tables } from "./database.js";
import { importDocuments } from "./migrate-mongo.js";

test("migration and customer/admin APIs on real MySQL/MariaDB", { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const options = connectionOptions({ DATABASE_URL: process.env.TEST_DATABASE_URL });
  const admin = await mysql.createConnection(options);
  const name = `ew_test_${crypto.randomBytes(6).toString("hex")}`;
  await admin.query(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin`);
  const connection = await mysql.createConnection({ ...options, database: name });
  let server;
  try {
    await initializeSchema(connection);
    const fixture = {
      products: [{ _id: "64aaaaaa0000000000000001", name: "Test suit", slug: "test-suit", status: "published", price: "Rs 2,000", sortOrder: 2, variants: [{ size: "M", stock: 4 }], createdAt: "2026-01-01T00:00:00.000Z" }],
      blogs: [{ _id: "old-blog", title: "Imported blog", status: "published", body: "اسلام علیکم", sortOrder: 1 }],
      customers: [{ _id: "old-customer", email: "existing@example.test", name: "Existing", passwordHash: "preserved:hash" }],
      orders: [{ _id: "old-order", customerId: "old-customer", customer: { email: "existing@example.test" }, items: [{ slug: "test-suit", qty: 2 }], createdAt: "2026-01-01T00:00:00.000Z" }],
      siteContent: [{ _id: "old-content", key: "main", settings: { name: "Imported shop" }, arbitrary: { retain: null } }],
      systemFlags: [{ _id: "old-flag", key: "removedDemoListings", completedAt: "2026-01-01T00:00:00.000Z" }],
    };
    const db = createRepository(connection);
    await t.test("failed import rolls back every table", async () => {
      const broken = structuredClone(fixture);
      broken.customers.push({ _id: "duplicate", email: "existing@example.test" });
      await assert.rejects(importDocuments(connection, broken));
      for (const table of Object.values(tables)) {
        const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
        assert.equal(Number(rows[0].count), 0);
      }
    });
    await t.test("import preserves IDs, nested fields, Unicode, passwords and is repeatable", async () => {
      const result = await importDocuments(connection, fixture);
      assert.equal(result.counts.orders, 1);
      for (const [table, documents] of Object.entries(fixture)) {
        for (const doc of documents) assert.deepEqual(await db.get(table, { _id: doc._id }), doc);
      }
      assert.equal((await importDocuments(connection, fixture)).alreadyImported, true);
      await db.update("siteContent", { key: "main" }, { arbitrary: null, added: { text: "a'b\\c" } });
      const updated = await db.get("siteContent", { key: "main" });
      assert.equal(updated.arbitrary, null);
      assert.equal(updated.added.text, "a'b\\c");
      assert.equal(updated.settings.name, "Imported shop");
    });

    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = `mysql://${encodeURIComponent(options.user)}:${encodeURIComponent(options.password || "")}@${options.host}:${options.port}/${name}`;
    process.env.ADMIN_PASSWORD = "test-admin-password";
    process.env.ADMIN_TOKEN = "test-admin-token";
    process.env.CUSTOMER_TOKEN_SECRET = "test-customer-secret";
    delete process.env.MIGRATE_FROM_MONGODB;
    const { app } = await import("./server.js");
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    async function request(route, method = "GET", data, token) {
      const response = await fetch(base + route, { method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}) });
      return { status: response.status, data: await response.json() };
    }
    let customer;
    let token;
    await t.test("health/public content, login and duplicate customers", async () => {
      assert.equal((await request("/api/health")).data.database, "mysql");
      const publicData = await request("/api/public-data");
      assert.equal(publicData.data.products[0].id, fixture.products[0]._id);
      assert.equal(publicData.data.blogs[0].body, "اسلام علیکم");
      const registered = await request("/api/customers/register", "POST", { name: "New customer", email: "new@example.test", password: "test-password" });
      assert.equal(registered.status, 201);
      customer = registered.data.customer;
      token = registered.data.token;
      assert.equal(customer.passwordHash, undefined);
      assert.equal((await request("/api/customers/register", "POST", { name: "Duplicate", email: "NEW@example.test", password: "test-password" })).status, 409);
      assert.equal((await request("/api/customers/login", "POST", { email: "new@example.test", password: "wrong" })).status, 401);
      assert.equal((await request("/api/customers/login", "POST", { email: "new@example.test", password: "test-password" })).status, 200);
      assert.equal((await request("/api/customer/me", "GET", undefined, token)).data.customer.id, customer.id);
    });
    await t.test("orders and admin CRUD use MySQL and keep ownership boundaries", async () => {
      const created = await request("/api/orders", "POST", { items: [{ slug: "test-suit", name: "Suit", price: "Rs 2,000", qty: 2 }], customer: { name: "Buyer", email: "new@example.test", phone: "000", address: "Test address" } }, token);
      assert.equal(created.status, 201);
      assert.equal(created.data.order.subtotal, 4000);
      const mine = (await request("/api/customer/orders", "GET", undefined, token)).data.orders;
      assert.equal(mine.length, 1);
      assert.equal(mine[0].customerId, customer.id);
      assert.equal((await request("/api/admin/dashboard")).status, 401);
      const adminToken = (await request("/api/admin/login", "POST", { password: "test-admin-password" })).data.token;
      const product = (await request("/api/admin/products", "POST", { name: "New suit", status: "published", sortOrder: 1, variants: [{ size: "L", stock: 3 }] }, adminToken)).data.product;
      assert.ok(product.id);
      assert.equal((await request(`/api/admin/products/${product.id}`, "PUT", { name: "Edited suit", status: "draft" }, adminToken)).data.product.name, "Edited suit");
      const blog = (await request("/api/admin/blogs", "POST", { title: "New blog" }, adminToken)).data.blog;
      assert.equal((await request(`/api/admin/blogs/${blog.id}`, "PUT", { title: "Edited blog" }, adminToken)).data.blog.title, "Edited blog");
      assert.equal((await request(`/api/admin/orders/${created.data.order.id}`, "PATCH", { status: "shipped", deliveryDays: "3", trackingNote: "Sent" }, adminToken)).data.order.status, "shipped");
      assert.equal((await request("/api/admin/content", "PUT", { settings: { name: "Updated shop" } }, adminToken)).data.content.settings.name, "Updated shop");
      assert.equal((await request(`/api/admin/products/${product.id}`, "DELETE", undefined, adminToken)).status, 200);
      assert.equal((await request(`/api/admin/blogs/${blog.id}`, "DELETE", undefined, adminToken)).status, 200);
      assert.equal(await db.get("products", { _id: product.id }), null);
      assert.equal((await db.get("orders", { _id: created.data.order.id })).status, "shipped");
    });
    await t.test("database failures return 503 without filesystem fallback or leaking credentials", async () => {
      await closeDb();
      process.env.DATABASE_URL = "mysql://secret-user:secret-password@127.0.0.1:1/unavailable";
      const health = await request("/api/health");
      assert.equal(health.status, 503);
      assert.equal(health.data.error, "Database unavailable");
      assert.equal((await request("/api/public-data")).status, 503);
      assert.equal((await request("/api/customers/register", "POST", { name: "Unavailable", email: "offline@example.test", password: "test" })).status, 503);
    });
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    await closeDb();
    await connection.end();
    await admin.query(`DROP DATABASE \`${name}\``);
    await admin.end();
  }
});
