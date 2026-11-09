import test from "node:test";
import assert from "node:assert/strict";
import { deliveredOrders, orderRevenue } from "../shared/order-revenue.js";

test("only delivered orders contribute revenue, regardless of payment status", () => {
  const orders = ["pending", "confirmed", "shipped", "out for delivery", "cancelled", "returned", "refunded", undefined]
    .map((status) => ({ status, subtotal: 1000, paymentStatus: "paid" }));
  orders.push({ status: "delivered", subtotal: "6299", paymentStatus: "cod" });
  orders.push({ status: " Delivered ", subtotal: 7199 });
  assert.equal(orderRevenue(orders), 13498);
  assert.equal(deliveredOrders(orders).length, 2);
});

test("revenue follows pending, delivered, and cancelled status transitions without double counting", () => {
  const order = { status: "pending", subtotal: 6299 };
  assert.equal(orderRevenue([order]), 0);
  order.status = "delivered";
  assert.equal(orderRevenue([order]), 6299);
  assert.equal(orderRevenue([order]), 6299);
  order.status = "cancelled";
  assert.equal(orderRevenue([order]), 0);
  assert.deepEqual(deliveredOrders([order]), []);
});

test("empty orders and delivered orders without an amount yield zero", () => {
  assert.equal(orderRevenue([]), 0);
  assert.equal(orderRevenue([{ status: "delivered" }]), 0);
});
