const acceptedTypes = /^image\/(jpeg|png|webp|gif)$/;

export async function prepareUpload(file) {
  if (file.size > 8 * 1024 * 1024) throw new Error("Photo must be smaller than 8 MB");
  if (!acceptedTypes.test(file.type)) throw new Error("Choose a JPG, PNG, WebP or GIF photo");
  if (file.size < 150000 || file.type === "image/gif") return file;
  const url = URL.createObjectURL(file);
  const image = new Image();
  let timer;
  try {
    await new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error("Photo could not be prepared. Try exporting it as JPG.")), 15000);
      image.onload = resolve;
      image.onerror = () => reject(new Error("Photo could not be opened. Choose another JPG, PNG or WebP file."));
      image.src = url;
    });
    let best = file;
    for (const [maxSize, quality] of [[1600, 0.82], [1280, 0.76]]) {
      const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      // WebP also preserves transparent PNG backgrounds.
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size < best.size) best = blob;
      canvas.width = canvas.height = 1;
      if (best.size <= 350000) break;
    }
    return best;
  } finally {
    clearTimeout(timer);
    image.src = "";
    URL.revokeObjectURL(url);
  }
}

export async function sendPreparedImage(body, fileName, token, fetcher = fetch) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetcher("/api/admin/uploads", {
        method: "POST", body, signal: controller.signal,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": body.type, "X-File-Name": encodeURIComponent(fileName) },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(payload.error || `Photo upload failed (${response.status})`);
        error.status = response.status;
        throw error;
      }
      if (!payload.url) throw new Error("The server did not return a photo. Please try again.");
      return payload;
    } catch (error) {
      const retryable = error.name === "AbortError" || error instanceof TypeError || [408, 429, 500, 502, 503, 504].includes(error.status);
      if (!retryable) throw error;
      if (attempt === 2) throw new Error("The upload connection is unavailable. Your product details are safe; please try Upload again.");
    } finally { clearTimeout(timer); }
  }
}

