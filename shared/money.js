export function priceAmount(value) {
  return Number(String(value ?? "").replace(/(?:PKR|USD|RS\.?)/gi, "").replace(/[^0-9.-]/g, "")) || 0;
}

export function formatPKR(value) {
  const amount = priceAmount(value);
  return `PKR ${amount.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
}

