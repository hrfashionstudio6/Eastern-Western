export async function loadSiteData({ signal, fetcher = fetch } = {}) {
  const response = await fetcher("/api/public-data", { cache: "no-store", signal });
  if (!response.ok) throw new Error("Site content could not be loaded.");
  const payload = await response.json();
  if (!payload?.content || typeof payload.content !== "object" || Array.isArray(payload.content) || !Array.isArray(payload.products) || !Array.isArray(payload.blogs)) {
    throw new Error("Site content was incomplete.");
  }
  return payload;
}
