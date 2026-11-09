// Recognize merchandise revenue only while an order is delivered.
export function deliveredOrders(orders) {
  return orders.filter((order) => String(order.status || "").trim().toLowerCase() === "delivered");
}

export function orderRevenue(orders) {
  return deliveredOrders(orders).reduce((sum, order) => sum + Number(order.subtotal || 0), 0);
}
