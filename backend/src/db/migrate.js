import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connectionConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || "localhost",
        port: parseInt(process.env.PGPORT || "5432", 10),
        database: process.env.PGDATABASE || "hotel_booking",
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "postgres"
      };

  const pool = new Pool(connectionConfig);

  try {
    console.log("[Migration] Connecting to PostgreSQL database...");
    const client = await pool.connect();

    const sqlFile = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(sqlFile, "utf-8");

    console.log("[Migration] Executing schema.sql...");
    await client.query(sql);

    console.log(" Schema migration completed successfully!");
    client.release();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
