import { MongoClient } from "mongodb";
import fs from "node:fs/promises";
import { createRepository, tables } from "./database.js";

function normalizeMongoUri(uri, dbName) {
  const value = String(uri || "").trim();
  const match = value.match(/^mongodb\+srv:\/\/([^@]+)@cluster0\.qrsel9m\.mongodb\.net\/?(?:\?(.*))?$/);
  if (!match) return value;
  const credentials = match[1];
  const query = new URLSearchParams(match[2] || "");
  query.set("replicaSet", "atlas-10svam-shard-0");
  query.set("authSource", query.get("authSource") || "admin");
  query.set("tls", "true");
  query.set("retryWrites", query.get("retryWrites") || "true");
  query.set("w", query.get("w") || "majority");
  return `mongodb://${credentials}@ac-8iufvlj-shard-00-00.qrsel9m.mongodb.net:27017,ac-8iufvlj-shard-00-01.qrsel9m.mongodb.net:27017,ac-8iufvlj-shard-00-02.qrsel9m.mongodb.net:27017/${dbName}?${query.toString()}`;
}


export async function importDocuments(connection, documents) {
  const db = createRepository(connection);
  const marker = { key: "mysqlMigrationV1" };
  if (await db.get("systemFlags", marker)) return { alreadyImported: true };
  for (const name of Object.keys(tables)) {
    const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${tables[name]}\``);
    if (Number(rows[0].count)) throw new Error("Migration requires empty destination tables");
  }
  const counts = {};
  await connection.beginTransaction();
  try {
    for (const name of Object.keys(tables)) {
      counts[name] = 0;
      for (const input of documents[name] || []) {
        const document = JSON.parse(JSON.stringify(input));
        document._id = String(input._id || input.id || "");
        if (!document._id) throw new Error("Source document has no identifier");
        await db.insert(name, document);
        const saved = await db.get(name, { _id: document._id });
        if (JSON.stringify(saved) !== JSON.stringify({ ...document, _id: document._id })) {
          // Compare JSON values independently of database object-key ordering.
          const { isDeepStrictEqual } = await import("node:util");
          if (!isDeepStrictEqual(saved, document)) throw new Error("Imported document verification failed");
        }
        counts[name]++;
      }
      const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${tables[name]}\``);
      if (Number(rows[0].count) !== counts[name]) throw new Error("Imported record count mismatch");
    }
    await db.insert("systemFlags", { ...marker, completedAt: new Date(), counts });
    await connection.commit();
    return { counts };
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

export async function migrateFromMongo(pool) {
  const connection = await pool.getConnection();
  let client;
  let session;
  let locked = false;
  try {
    const [locks] = await connection.query("SELECT GET_LOCK(SHA2(CONCAT(DATABASE(), ':ew-import'), 256), 30) AS acquired");
    locked = Number(locks[0].acquired) === 1;
    if (!locked) throw new Error("Another database migration is running");
    const db = createRepository(connection);
    if (await db.get("systemFlags", { key: "mysqlMigrationV1" })) return;
    if (!process.env.MONGODB_URI) throw new Error("Source MONGODB_URI is required for migration");
    const dbName = process.env.MONGODB_DB || "easternwestern";
    client = new MongoClient(normalizeMongoUri(process.env.MONGODB_URI, dbName), { serverSelectionTimeoutMS: 15000 });
    await client.connect();
    const source = client.db(dbName);
    session = client.startSession();
    session.startTransaction({ readConcern: { level: "snapshot" } });
    const documents = {};
    for (const name of Object.keys(tables)) documents[name] = await source.collection(name).find({}, { session }).toArray();
    await session.abortTransaction();
    // Preserve any records written through the old filesystem fallback as well.
    try {
      const store = JSON.parse(await fs.readFile(new URL("../data/local-store.json", import.meta.url), "utf8"));
      for (const name of ["products", "blogs", "orders", "customers"]) {
        const ids = new Set(documents[name].map((doc) => String(doc._id)));
        for (const doc of store[name] || []) if (doc.id && !ids.has(String(doc.id))) documents[name].push({ ...doc, _id: String(doc.id) });
      }
      if (!documents.siteContent.length && store.content) documents.siteContent.push({ ...store.content, key: "main", _id: "imported-local-content" });
    } catch (error) { if (error.code !== "ENOENT") throw error; }
    const result = await importDocuments(connection, documents);
    console.log("MongoDB to MySQL migration verified:", JSON.stringify(result.counts));
  } finally {
    if (session?.inTransaction()) await session.abortTransaction().catch(() => {});
    await session?.endSession();
    await client?.close();
    if (locked) await connection.query("SELECT RELEASE_LOCK(SHA2(CONCAT(DATABASE(), ':ew-import'), 256))");
    connection.release();
  }
}
