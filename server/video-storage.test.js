import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { videoHandlers, videoRange, VIDEO_CHUNK_BYTES } from "./video-storage.js";

function fixture() {
  const records = new Map();
  const db = {
    async get(_table, filter) { return records.get(filter._id); },
    async insert(_table, doc) { records.set(doc._id, { ...doc }); },
    async update(_table, filter, doc) { records.set(filter._id, { ...records.get(filter._id), ...doc, _id: filter._id }); },
  };
  const handlers = videoHandlers(async () => db);
  const response = () => ({
    code: 200, headers: {}, pieces: [], destroyed: false,
    status(code) { this.code = code; return this; },
    set(key, value) { Object.assign(this.headers, typeof key === "string" ? { [key]: value } : key); return this; },
    json(body) { this.body = body; return this; },
    end() { this.ended = true; return this; },
    write(bytes) { this.pieces.push(bytes); return true; },
    destroy() { this.destroyed = true; },
  });
  return { handlers, records, response };
}
test("video ranges support full, bounded, suffix and unsatisfiable requests", () => {
  assert.deepEqual(videoRange(undefined, 100), { start: 0, end: 99, partial: false });
  assert.deepEqual(videoRange("bytes=10-19", 100), { start: 10, end: 19, partial: true });
  assert.deepEqual(videoRange("bytes=-10", 100), { start: 90, end: 99, partial: true });
  assert.equal(videoRange("bytes=100-", 100), null);
  assert.equal(videoRange("bytes=1-0", 100), null);
  assert.equal(videoRange("bytes=0-1,4-5", 100), null);
});
test("chunk retries are idempotent and complete videos serve byte ranges across chunks", async () => {
  const f = fixture();
  const bytes = Buffer.alloc(VIDEO_CHUNK_BYTES + 17, 42);
  bytes.write("ftyp", 4, "ascii");
  const started = f.response();
  await f.handlers.start({ body: { size: bytes.length } }, started);
  const name = started.body.name;
  const chunk = async index => f.handlers.chunk({ params: { name, index: String(index) }, body: { base64: bytes.subarray(index * VIDEO_CHUNK_BYTES, (index + 1) * VIDEO_CHUNK_BYTES).toString("base64") } }, f.response());
  await chunk(0); await chunk(0); await chunk(1);
  assert.equal(f.records.size, 3);
  const notReady = f.response();
  await f.handlers.serve({ params: { name } }, notReady);
  assert.equal(notReady.code, 404);
  const complete = f.response();
  await f.handlers.complete({ params: { name } }, complete);
  assert.equal(complete.body.url, "/api/videos/" + name);
  assert.equal(f.records.get(name).sha256, crypto.createHash("sha256").update(bytes).digest("hex"));
  const served = f.response();
  await f.handlers.serve({ params: { name }, method: "GET", get: () => "bytes=524280-524296" }, served);
  assert.equal(served.code, 206);
  assert.equal(served.headers["Content-Length"], "17");
  assert.deepEqual(Buffer.concat(served.pieces), bytes.subarray(524280, 524297));
  const head = f.response();
  await f.handlers.serve({ params: { name }, method: "HEAD", get: () => undefined }, head);
  assert.equal(head.headers["Content-Length"], String(bytes.length));
  assert.equal(head.pieces.length, 0);
});
test("oversize, incomplete and disguised non-MP4 uploads never publish", async () => {
  const f = fixture();
  await assert.rejects(f.handlers.start({ body: { size: 65 * 1024 * 1024 } }, f.response()), { status: 400 });
  const started = f.response();
  await f.handlers.start({ body: { size: 20 } }, started);
  const name = started.body.name;
  await assert.rejects(f.handlers.complete({ params: { name } }, f.response()), { status: 400 });
  await assert.rejects(f.handlers.chunk({ params: { name, index: "0" }, body: { base64: Buffer.alloc(20).toString("base64") } }, f.response()), { status: 400 });
  assert.equal(f.records.get(name).complete, false);
});
