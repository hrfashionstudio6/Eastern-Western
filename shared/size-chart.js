const text = (value) => String(value ?? "").trim();
// Spreadsheets store 30 as 30 and 8.3 as 8.3; show them without trailing zeros.
const cell = (value) => typeof value === "number" ? String(Number(value.toFixed(2))) : text(value);

// Reads the Eastern Western size chart sheet: a "… CHART | INCHES" title row,
// a "Measurement | XS | S …" heading row, then one row per measurement.
export function parseSizeChart(rows = []) {
  const sections = [];
  let current = null;
  for (const row of rows) {
    const cells = (Array.isArray(row) ? row : []).map(cell);
    const [label, ...rest] = cells;
    if (!label) continue;
    if (/chart/i.test(label) && rest.every((value) => !value)) {
      current = { title: label.replace(/\s*\|\s*/g, " · "), sizes: [], rows: [] };
      sections.push(current);
    } else if (current && /^measurement$/i.test(label)) {
      current.sizes = rest.filter(Boolean);
    } else if (current && current.sizes.length && rest.some(Boolean)) {
      current.rows.push([label, ...rest.slice(0, current.sizes.length)]);
    }
  }
  const valid = sections.filter((section) => section.sizes.length && section.rows.length);
  if (!valid.length) throw new Error("This file doesn't look like a size chart. Use the Eastern Western size chart template.");
  return { sections: valid };
}

// Keeps only the expected shape when a chart is saved from the admin.
export function cleanSizeChart(chart) {
  if (!chart || !Array.isArray(chart.sections)) return null;
  const sections = chart.sections.slice(0, 6).map((section) => ({
    title: text(section?.title).slice(0, 80),
    sizes: (Array.isArray(section?.sizes) ? section.sizes : []).slice(0, 12).map((size) => text(size).slice(0, 12)),
    rows: (Array.isArray(section?.rows) ? section.rows : []).slice(0, 30).map((row) => (Array.isArray(row) ? row : []).slice(0, 13).map((value) => text(value).slice(0, 40))),
  })).filter((section) => section.sizes.length && section.rows.length);
  return sections.length ? { sections } : null;
}
