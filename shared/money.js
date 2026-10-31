export function formatPKR(value) {
  const amount = Number(String(value ?? "").replace(/[^0-9.-]/g, "")) || 0;
  return `PKR ${amount.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
}

