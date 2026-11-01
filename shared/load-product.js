export async function loadProduct(slug, { signal, fetcher = fetch } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetcher(`/api/products/${encodeURIComponent(slug)}`, { cache: "no-store", signal });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Product could not be loaded. Please try again.");
      const payload = await response.json();
      if (!payload.product) throw new Error("Product response was incomplete. Please try again.");
      return payload.product;
    } catch (error) {
      if (signal?.aborted || attempt === 2) throw error;
    }
  }
}

