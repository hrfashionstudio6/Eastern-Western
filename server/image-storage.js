import crypto from "node:crypto";

export async function storeImage(db, buffer, mime, extension) {
  // A retry after a lost response must reuse the completed upload.
  const name = `${crypto.createHash("sha256").update(buffer).digest("hex")}${extension}`;
  if (!await db.get("uploads", { _id: name })) {
    try { await db.insert("uploads", { _id: name, mime: mime.toLowerCase(), base64: buffer.toString("base64") }); }
    catch (error) { if (error.code !== "ER_DUP_ENTRY") throw error; }
  }
  return `/api/media/${name}`;
}

