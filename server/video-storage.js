import crypto from "node:crypto";

export const VIDEO_CHUNK_BYTES = 512 * 1024;
export const VIDEO_MAX_BYTES = 64 * 1024 * 1024;
const validName = name => /^[a-f0-9]{32}\.mp4$/.test(name);
function invalid(message) { const error = new Error(message); error.status = 400; throw error; }
export function videoRange(header, size) {
  if (!header) return { start: 0, end: size - 1, partial: false };
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start >= 0 && start < size && end >= start ? { start, end, partial: true } : null;
}
export function videoHandlers(getDb) {
  async function manifest(name, complete = false) {
    if (!validName(name)) invalid("Invalid video");
    const db = await getDb();
    const record = await db.get("uploads", { _id: name });
    if (!record || record.kind !== "video" || (complete && !record.complete)) return null;
    return record;
  }
  return {
    async start(req, res) {
      const size = req.body?.size;
      if (!Number.isSafeInteger(size) || size < 12 || size > VIDEO_MAX_BYTES) invalid("Choose an MP4 video smaller than 64 MB.");
      const name = crypto.randomBytes(16).toString("hex") + ".mp4";
      await (await getDb()).insert("uploads", { _id: name, kind: "video", mime: "video/mp4", size, chunks: Math.ceil(size / VIDEO_CHUNK_BYTES), complete: false });
      res.status(201).json({ name, chunkBytes: VIDEO_CHUNK_BYTES });
    },
    async chunk(req, res) {
      const record = await manifest(req.params.name);
      if (!record) return res.status(404).end();
      if (record.complete) return res.status(409).json({ error: "Video upload is already complete" });
      const index = Number(req.params.index);
      if (!Number.isInteger(index) || index < 0 || index >= record.chunks) invalid("Invalid video chunk");
      const encoded = req.body?.base64;
      if (typeof encoded !== "string" || !/^[a-zA-Z0-9+/]+={0,2}$/.test(encoded)) invalid("Invalid video data");
      const bytes = Buffer.from(encoded, "base64");
      const expected = Math.min(VIDEO_CHUNK_BYTES, record.size - index * VIDEO_CHUNK_BYTES);
      if (bytes.length !== expected || bytes.toString("base64") !== encoded) invalid("Incomplete video chunk");
      if (index === 0 && bytes.toString("ascii", 4, 8) !== "ftyp") invalid("Choose a valid MP4 video");
      await (await getDb()).update("uploads", { _id: record._id + "." + index }, { kind: "video-chunk", base64: encoded }, { upsert: true });
      res.json({ ok: true });
    },
    async complete(req, res) {
      const record = await manifest(req.params.name);
      if (!record) return res.status(404).end();
      const db = await getDb();
      if (!record.complete) {
        const hash = crypto.createHash("sha256");
        for (let i = 0; i < record.chunks; i++) {
          const chunk = await db.get("uploads", { _id: record._id + "." + i });
          if (!chunk) invalid("Video upload is incomplete. Please choose the file again.");
          hash.update(Buffer.from(chunk.base64, "base64"));
        }
        await db.update("uploads", { _id: record._id }, { complete: true, sha256: hash.digest("hex") });
      }
      res.json({ url: "/api/videos/" + record._id });
    },
    async serve(req, res) {
      if (!validName(req.params.name)) return res.status(404).end();
      const record = await manifest(req.params.name, true);
      if (!record) return res.status(404).end();
      const range = videoRange(req.get("range"), record.size);
      res.set({ "Accept-Ranges": "bytes", "Content-Type": "video/mp4", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" });
      if (!range) return res.status(416).set("Content-Range", "bytes */" + record.size).end();
      const { start, end, partial } = range;
      res.status(partial ? 206 : 200).set("Content-Length", String(end - start + 1));
      if (partial) res.set("Content-Range", "bytes " + start + "-" + end + "/" + record.size);
      if (req.method === "HEAD") return res.end();
      const db = await getDb();
      try {
        for (let i = Math.floor(start / VIDEO_CHUNK_BYTES); i <= Math.floor(end / VIDEO_CHUNK_BYTES); i++) {
          if (res.destroyed) return;
          const chunk = await db.get("uploads", { _id: record._id + "." + i });
          if (!chunk) throw new Error("Missing video data");
          const bytes = Buffer.from(chunk.base64, "base64");
          const offset = i * VIDEO_CHUNK_BYTES;
          const piece = bytes.subarray(Math.max(0, start - offset), Math.min(bytes.length, end - offset + 1));
          if (!res.write(piece)) await new Promise(resolve => {
            const done = () => { res.off("drain", done); res.off("close", done); resolve(); };
            res.once("drain", done); res.once("close", done);
          });
        }
        res.end();
      } catch { res.destroy(); }
    },
  };
}
