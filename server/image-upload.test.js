import test from "node:test";
import assert from "node:assert/strict";
import { sendPreparedImage, prepareUpload } from "../src/image-upload.js";
import { storeImage } from "./image-storage.js";

test("upload sends the original Blob and retries temporary gateway errors", async () => {
  const body = new Blob(["photo"], { type: "image/webp" });
  let attempts = 0;
  const result = await sendPreparedImage(body, "لباس.jpg", "test-token", async (url, options) => {
    assert.equal(url, "/api/admin/uploads");
    if (!attempts) {
      assert.equal(options.body, body);
      assert.equal(options.headers["Content-Type"], "image/webp");
    } else {
      assert.equal(options.headers["Content-Type"], "application/json");
      const upload = JSON.parse(options.body);
      assert.equal(upload.fileName, "لباس.jpg");
      assert.equal(upload.dataUrl, "data:image/webp;base64,cGhvdG8=");
    }
    return ++attempts === 1 ? new Response("gateway", { status: 504 }) : Response.json({ url: "/api/media/photo.webp" });
  });
  assert.equal(attempts, 2);
  assert.equal(result.url, "/api/media/photo.webp");
});

test("bad credentials are not retried and network failures stop after three attempts", async () => {
  let attempts = 0;
  const blob = new Blob(["photo"], { type: "image/jpeg" });
  await assert.rejects(sendPreparedImage(blob, "photo.jpg", "", async () => {
    attempts++;
    return Response.json({ error: "Login expired" }, { status: 401 });
  }), /Login expired/);
  assert.equal(attempts, 1);
  attempts = 0;
  await assert.rejects(sendPreparedImage(blob, "photo.jpg", "", async () => { attempts++; throw new TypeError("Offline"); }), /details are safe/);
  assert.equal(attempts, 3);
});

test("small photos bypass decoding; invalid and oversized files fail before upload", async () => {
  const photo = new Blob(["photo"], { type: "image/jpeg" });
  assert.equal(await prepareUpload(photo), photo);
  await assert.rejects(prepareUpload({ size: 9000000, type: "image/jpeg" }), /8 MB/);
  await assert.rejects(prepareUpload({ size: 10, type: "application/pdf" }), /Choose a JPG/);
});

test("a retried photo is stored once and receives the same persistent URL", async () => {
  const rows = new Map();
  let inserts = 0;
  const db = { get: async (_, filter) => rows.get(filter._id), insert: async (_, row) => { inserts++; rows.set(row._id, row); } };
  const photo = Buffer.from("photo");
  const first = await storeImage(db, photo, "image/webp", ".webp");
  assert.equal(await storeImage(db, photo, "image/webp", ".webp"), first);
  assert.equal(inserts, 1);
  assert.deepEqual(Buffer.from([...rows.values()][0].base64, "base64"), photo);
});

