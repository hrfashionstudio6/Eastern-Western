import mysql from "mysql2/promise";
import crypto from "node:crypto";

export const tables = Object.freeze({
  products: "ew_products", blogs: "ew_blogs", customers: "ew_customers",
  orders: "ew_orders", siteContent: "ew_site_content", systemFlags: "ew_system_flags", uploads: "ew_uploads",
});
let dbPromise;
let pool;

export function databaseConfigured(env = process.env) {
  return Boolean(env.DATABASE_URL || env.DB_HOST || env.DB_NAME || env.DB_USER);
}

export function connectionOptions(env = process.env) {
  let options;
  if (env.DATABASE_URL) {
    const url = new URL(env.DATABASE_URL);
    if (!["mysql:", "mariadb:"].includes(url.protocol)) throw new Error("DATABASE_URL must use mysql://");
    options = { host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password), database: decodeURIComponent(url.pathname.slice(1)) };
  } else {
    options = { host: env.DB_HOST || "localhost", port: Number(env.DB_PORT || 3306),
      user: env.DB_USER, password: env.DB_PASSWORD, database: env.DB_NAME };
  }
  if (!options.user || !options.database) throw new Error("MySQL database credentials are missing");
  return { ...options, charset: "utf8mb4", connectionLimit: 5, waitForConnections: true,
    queueLimit: 50, connectTimeout: 10000, multipleStatements: false,
    ...(env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: true } } : {}) };
}

function table(name) {
  if (!Object.hasOwn(tables, name)) throw new Error("Unknown data table");
  return `\`${tables[name]}\``;
}

const fields = new Set(["id", "key", "email", "status", "slug", "customerId", "customer.email"]);
export function where(filter = {}, values = []) {
  const parts = Object.entries(filter).map(([key, value]) => {
    if (key === "$or") {
      if (!Array.isArray(value) || !value.length) throw new Error("Invalid OR filter");
      return `(${value.map((item) => where(item, values).sql).join(" OR ")})`;
    }
    let expression;
    if (key === "_id") expression = "id";
    else {
      if (!fields.has(key)) throw new Error("Unsupported filter field");
      expression = `JSON_UNQUOTE(JSON_EXTRACT(document, '$.${key}'))`;
    }
    if (value && typeof value === "object") {
      if (!Array.isArray(value.$in) || Object.keys(value).length !== 1) throw new Error("Unsupported filter");
      if (!value.$in.length) return "0 = 1";
      values.push(...value.$in.map(String));
      return `${expression} IN (${value.$in.map(() => "?").join(",")})`;
    }
    values.push(String(value));
    return `${expression} = ?`;
  });
  return { sql: parts.length ? parts.join(" AND ") : "1 = 1", values };
}

function decode(row) {
  if (!row) return null;
  const document = typeof row.document === "string" ? JSON.parse(row.document) : row.document;
  return { ...document, _id: row.id };
}

export async function initializeSchema(executor) {
  for (const [name] of Object.entries(tables)) {
    const unique = name === "customers"
      ? ", email VARCHAR(254) GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(document, '$.email'))) STORED, UNIQUE KEY unique_email (email)"
      : ["siteContent", "systemFlags"].includes(name)
        ? ", lookup_key VARCHAR(191) GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(document, '$.key'))) STORED, UNIQUE KEY unique_key (lookup_key)" : "";
    await executor.query(`CREATE TABLE IF NOT EXISTS ${table(name)} (id VARCHAR(191) NOT NULL PRIMARY KEY, document JSON NOT NULL${unique}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin`);
  }
}

export function createRepository(executor) {
  return {
    async ping() { await executor.query("SELECT 1"); },
    async get(name, filter) {
      const query = where(filter);
      const [rows] = await executor.execute(`SELECT id, document FROM ${table(name)} WHERE ${query.sql} LIMIT 1`, query.values);
      return decode(rows[0]);
    },
    async list(name, filter = {}, sort = {}) {
      const query = where(filter);
      const ordering = Object.entries(sort).map(([key, direction]) => {
        if (!["sortOrder", "createdAt"].includes(key) || ![1, -1].includes(direction)) throw new Error("Unsupported ordering");
        const expression = key === "sortOrder" ? "CAST(JSON_UNQUOTE(JSON_EXTRACT(document, '$.sortOrder')) AS DECIMAL(20,6))" : "JSON_UNQUOTE(JSON_EXTRACT(document, '$.createdAt'))";
        return `${expression} ${direction === -1 ? "DESC" : "ASC"}`;
      });
      const [rows] = await executor.execute(`SELECT id, document FROM ${table(name)} WHERE ${query.sql}${ordering.length ? ` ORDER BY ${ordering.join(", ")}, id ASC` : ""}`, query.values);
      return rows.map(decode);
    },
    async insert(name, input) {
      const { _id, ...document } = input;
      const id = String(_id || crypto.randomBytes(12).toString("hex"));
      await executor.execute(`INSERT INTO ${table(name)} (id, document) VALUES (?, ?)`, [id, JSON.stringify(document)]);
      return { insertedId: id };
    },
    async insertMany(name, documents) {
      const connection = await executor.getConnection();
      try {
        await connection.beginTransaction();
        const repository = createRepository(connection);
        for (const document of documents) await repository.insert(name, document);
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally { connection.release(); }
    },
    async update(name, filter, input, { upsert = false } = {}) {
      const { _id: _ignoredId, ...document } = input;
      const query = where(filter);
      const values = [];
      const assignments = Object.entries(document).filter(([, value]) => value !== undefined).map(([key, value]) => {
        values.push(`$.${JSON.stringify(key)}`, JSON.stringify(value));
        return "?, JSON_EXTRACT(?, '$')";
      });
      if (!assignments.length) return;
      const [result] = await executor.execute(`UPDATE ${table(name)} SET document = JSON_SET(document, ${assignments.join(", ")}) WHERE ${query.sql}`, [...values, ...query.values]);
      if (upsert && !result.affectedRows && !await this.get(name, filter)) {
        try { await this.insert(name, { ...filter, ...document }); }
        catch (error) { if (error.code !== "ER_DUP_ENTRY") throw error; await this.update(name, filter, document); }
      }
    },
    async remove(name, filter) {
      if (!Object.keys(filter || {}).length) throw new Error("Delete requires a filter");
      const query = where(filter);
      await executor.execute(`DELETE FROM ${table(name)} WHERE ${query.sql}`, query.values);
    },
  };
}

export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      pool = mysql.createPool(connectionOptions());
      await initializeSchema(pool);
      const db = createRepository(pool);
      if (process.env.MIGRATE_FROM_MONGODB === "true") {
        const { migrateFromMongo } = await import("./migrate-mongo.js");
        await migrateFromMongo(pool);
      }
      return db;
    })().catch(async (error) => {
      await pool?.end().catch(() => {});
      pool = undefined;
      dbPromise = undefined;
      throw error;
    });
  }
  return dbPromise;
}

export async function closeDb() {
  await pool?.end();
  pool = undefined;
  dbPromise = undefined;
}

