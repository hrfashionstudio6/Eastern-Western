const shades = [
  ["Midnight navy", "#172238", ["midnight navy blue", "midnight navy"]],
  ["Navy blue", "#20334f", ["deep navy blue", "navy blue", "deep navy", "navy"]],
  ["Ivory", "#f4efe3", ["warm ivory", "soft ivory", "ivory"]],
  ["Off-white", "#f6f3eb", ["off white"]],
  ["Cream", "#f0e2c4", ["warm cream", "cream"]],
  ["Dusty rose", "#c79b9e", ["soft dusty rose", "dusty rose", "muted rose pink", "muted rose", "rose pink"]],
  ["Blush pink", "#e7b9bf", ["blush pink", "muted pink", "pink"]],
  ["Sage green", "#a0aa8f", ["sage green", "sage"]],
  ["Olive green", "#77784c", ["olive green", "earthy olive", "olive"]],
  ["Antique gold", "#ad914b", ["antique gold"]],
  ["Gold", "#c8a455", ["muted gold", "soft gold", "gold toned", "golden detailing", "gold"]],
  ["Champagne", "#dfccab", ["champagne"]],
  ["Beige", "#cbb79b", ["warm beige", "muted beige", "beige"]],
  ["Terracotta", "#bb6d50", ["warm terracotta", "terracotta"]],
  ["Rust", "#a34f36", ["deep rust", "rust orange", "rust red", "rust"]],
  ["Orange", "#d58144", ["burnt orange", "orange"]],
  ["Peach", "#e9ba9d", ["muted peach", "peach"]],
  ["Coral", "#d68d80", ["muted coral", "coral"]],
  ["Brown", "#806149", ["warm brown", "earthy brown", "brown"]],
  ["Chocolate brown", "#4f342d", ["dark chocolate brown", "chocolate brown", "dark cocoa"]],
  ["Espresso", "#44312b", ["espresso brown", "espresso"]],
  ["Black", "#202020", ["classic black", "black"]],
  ["Emerald green", "#245a4a", ["dark emerald green", "deep emerald", "emerald green", "emerald"]],
  ["Forest green", "#2e5142", ["forest green"]],
  ["Green", "#87937b", ["muted green", "green"]],
  ["Teal", "#285859", ["deep teal", "teal"]],
  ["Mustard", "#bd963c", ["muted mustard", "mustard yellow", "mustard"]],
  ["Yellow", "#e5c45f", ["golden yellow", "yellow"]],
  ["Butter yellow", "#ecdda6", ["pale golden yellow", "butter yellow"]],
  ["Amber", "#b47c37", ["amber"]],
  ["Slate blue", "#71849c", ["slate blue"]],
  ["Powder blue", "#aec4d1", ["muted powder blue", "powder blue", "dusty blue"]],
  ["Denim blue", "#577791", ["denim blue"]],
  ["Blue", "#587fad", ["blue"]],
  ["White", "#faf9f5", ["white"]],
  ["Grey", "#929391", ["dark grey", "dark gray", "grey", "gray"]],
  ["Red", "#a52d38", ["crimson red", "brick red", "red"]],
  ["Purple", "#80648e", ["purple", "violet"]],
  ["Lavender", "#b8a4c7", ["lavender", "lilac"]],
  ["Burgundy", "#702c3f", ["burgundy", "maroon"]],
  ["Turquoise", "#56a6a5", ["turquoise"]],
  ["Silver", "#b6b9bb", ["silver"]],
];
const rules = shades.flatMap(([name, hex, aliases]) => aliases.map(alias => ({ name, hex, alias }))).sort((a, b) => b.alias.length - a.alias.length);

export function colourPalette(value) {
  const original = String(value || "").trim();
  if (!original) return [];
  if (/^#(?:[a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(original) || /^(?:rgb|hsl)a?\([\d\s.,%/+\-]+\)$/i.test(original)) {
    return [{ name: original, hex: original }];
  }
  const text = original.toLowerCase().replace(/[-–—]/g, " ");
  const occupied = new Set();
  const matches = [];
  for (const rule of rules) {
    const pattern = new RegExp("\\b" + rule.alias + "\\b", "g");
    for (const match of text.matchAll(pattern)) {
      const positions = Array.from({ length: rule.alias.length }, (_, offset) => match.index + offset);
      if (positions.some(position => occupied.has(position))) continue;
      positions.forEach(position => occupied.add(position));
      matches.push({ name: rule.name, hex: rule.hex, index: match.index });
    }
  }
  const seen = new Set();
  return matches.sort((a, b) => a.index - b.index).filter(item => {
    if (seen.has(item.hex)) return false;
    seen.add(item.hex);
    return true;
  }).map(({ name, hex }) => ({ name, hex }));
}

export function splitSizes(value) {
  const seen = new Set();
  return String(value || "").split(/[,;|/\r\n]+/).map(size => size.trim()).filter(size => {
    const key = size.toLowerCase();
    if (!size || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function availableStock(product, variant) {
  const count = value => value === "" || value == null || !Number.isFinite(Number(value)) ? null : Math.max(0, Math.floor(Number(value)));
  const amounts = [count(product.stock), count(variant?.stock)].filter(value => value !== null);
  return amounts.length ? Math.min(...amounts) : 0;
}

export function matchingVariant(variants, color, size, product, inStockOnly = false) {
  return variants.findIndex(variant =>
    (!color || String(variant.color || "").trim() === color) &&
    (!size || splitSizes(variant.size).includes(size)) &&
    (!inStockOnly || availableStock(product, variant) > 0)
  );
}

export function descriptionSections(value) {
  const pieces = String(value || "").split(/(?:^|\n)\s*(Styling Tip|Article Care)\s*:\s*/gi);
  const result = { details: pieces[0].trim(), styling: "", care: "" };
  for (let i = 1; i < pieces.length; i += 2) {
    result[/styling/i.test(pieces[i]) ? "styling" : "care"] = String(pieces[i + 1] || "").trim();
  }
  return result;
}
