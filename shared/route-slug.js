export function routeSlug(pathname) {
  const segment = pathname.replace(/\/+$/, "").split("/").pop() || "";
  try { return decodeURIComponent(segment); }
  catch { return segment; }
}

