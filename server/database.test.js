import test from "node:test";
import assert from "node:assert/strict";
import { connectionOptions, where, createRepository } from "./database.js";

test("Hostinger environment and URL credentials support escaped passwords", () => {
  assert.equal(connectionOptions({ DB_NAME: "site", DB_USER: "app", DB_PASSWORD: "a@:/?#" }).password, "a@:/?#");
  const config = connectionOptions({ DATABASE_URL: "mysql://app:a%40%3A%2F%3F%23@localhost:3307/site" });
  assert.equal(config.password, "a@:/?#");
  assert.equal(config.port, 3307);
  assert.throws(() => connectionOptions({ DATABASE_URL: "mongodb://localhost/site" }));
});

test("filters keep customer and injected IDs in parameters", () => {
  const injected = "x' OR 1=1 --";
  const query = where({ $or: [{ customerId: injected }, { "customer.email": "owner@example.test" }] });
  assert.ok(!query.sql.includes(injected));
  assert.deepEqual(query.values, [injected, "owner@example.test"]);
  assert.equal(where({ slug: { $in: [] } }).sql, "0 = 1");
  assert.throws(() => where({ "x') OR 1=1 --": "bad" }));
  assert.throws(() => where({ status: { $ne: "draft" } }));
});

test("unknown tables and unfiltered deletes cannot reach SQL", async () => {
  const db = createRepository({ execute() { assert.fail("SQL must not run"); } });
  await assert.rejects(db.remove("products", {}));
  await assert.rejects(db.get("products; DROP TABLE customers", { _id: "x" }));
  await assert.rejects(db.list("orders", {}, { "createdAt; DROP TABLE orders": 1 }));
});
