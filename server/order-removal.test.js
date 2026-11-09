import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

test("only an authenticated admin can permanently remove the selected order", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "ew-order-removal-"));
  let server;
  try {
    await fs.cp(path.join(root, "server"), path.join(temp, "server"), { recursive: true });
    await fs.cp(path.join(root, "shared"), path.join(temp, "shared"), { recursive: true });
    await fs.symlink(path.join(root, "node_modules"), path.join(temp, "node_modules"), "dir");
    await fs.writeFile(path.join(temp, "package.json"), '{"type":"module"}');
    await fs.mkdir(path.join(temp, "data"));
    const storePath = path.join(temp, "data/local-store.json");
    const keep = { id: "keep", orderNo: "EW-2", subtotal: 2000, status: "delivered" };
    await fs.writeFile(storePath, JSON.stringify({ products: [], blogs: [], customers: [], orders: [{ id: "remove", orderNo: "EW-1", subtotal: 1000 }, keep] }));
    process.env.NODE_ENV = "test";
    process.env.ADMIN_TOKEN = "order-removal-test-token";
    const { app } = await import(pathToFileURL(path.join(temp, "server/server.js")));
    server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    const base = `http://127.0.0.1:${server.address().port}/api/admin/orders/`;
    for (const headers of [{}, { Authorization: "Bearer wrong" }]) {
      assert.equal((await fetch(base + "remove", { method: "DELETE", headers })).status, 401);
      assert.equal(JSON.parse(await fs.readFile(storePath)).orders.length, 2);
    }
    const headers = { Authorization: "Bearer order-removal-test-token" };
    const removed = await fetch(base + "remove", { method: "DELETE", headers });
    assert.equal(removed.status, 200);
    assert.deepEqual(await removed.json(), { ok: true });
    assert.deepEqual(JSON.parse(await fs.readFile(storePath)).orders, [keep]);
    assert.equal((await fetch(base + "remove", { method: "DELETE", headers })).status, 404);
    assert.equal((await fetch(base + "missing", { method: "DELETE", headers })).status, 404);
    assert.deepEqual(JSON.parse(await fs.readFile(storePath)).orders, [keep]);
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await fs.rm(temp, { recursive: true, force: true });
  }
});
