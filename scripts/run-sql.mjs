// Runs supabase/schema.sql against the Postgres database.
// Usage:  DATABASE_URL="postgresql://postgres:PASSWORD@db.nbostqkgulskntvmkrgs.supabase.co:5432/postgres" node scripts/run-sql.mjs
// (requires: npm i pg)
import { readFileSync } from "node:fs";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL first.");
  process.exit(1);
}

const sql = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("✓ schema.sql applied successfully");
} catch (err) {
  console.error("SQL error:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
