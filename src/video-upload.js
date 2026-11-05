export async function uploadVideoFile(file, token, onProgress = () => {}, fetcher = fetch) {
  if (!/\.mp4$/i.test(file.name) || file.size < 12 || file.size > 64 * 1024 * 1024) throw new Error("Choose an MP4 video smaller than 64 MB.");
  async function send(url, body) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 60000);
      try {
        const response = await fetcher(url, { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) { const error = new Error(data.error || "Video upload failed (" + response.status + ")"); error.status = response.status; throw error; }
        return data;
      } catch (error) {
        if (attempt === 2 || (error.status && error.status < 500 && ![408, 429].includes(error.status))) throw error;
      } finally { clearTimeout(timer); }
    }
  }
  const upload = await send("/api/admin/videos/start", { size: file.size });
  for (let offset = 0, index = 0; offset < file.size; offset += upload.chunkBytes, index++) {
    const bytes = new Uint8Array(await file.slice(offset, offset + upload.chunkBytes).arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    await send("/api/admin/videos/" + upload.name + "/chunks/" + index, { base64: btoa(binary) });
    onProgress(Math.round(Math.min(file.size, offset + upload.chunkBytes) / file.size * 100));
  }
  return send("/api/admin/videos/" + upload.name + "/complete", {});
}
