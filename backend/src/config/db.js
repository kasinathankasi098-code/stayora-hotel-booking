import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  hotelLocations,
  initialHotels,
  initialRooms,
  initialBookings
} from "../db/initialData.js";

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;

const connectionConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432", 10),
      database: process.env.PGDATABASE || "hotel_booking",
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "1234",
      connectionTimeoutMillis: 3000
    };

pool = new Pool(connectionConfig);

pool.on("error", (err) => {
  console.error("[PostgreSQL Pool Error]:", err.message);
});


async function initializePostgres() {
  if (!pool) return false;

  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, "../db/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    await client.query(schemaSql);
    console.log("[PostgreSQL] Tables verified and created successfully.");

    // Seed hotels if table is empty
    const hotelCountRes = await client.query("SELECT COUNT(*) FROM hotels");
    if (parseInt(hotelCountRes.rows[0].count, 10) === 0) {
      console.log("[PostgreSQL] Seeding initial hotels...");
      for (const hotel of initialHotels) {
        await client.query(
          `INSERT INTO hotels (id, name, city, state, destination, rating, price, rooms, image, description, amenities, latitude, longitude)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING`,
          [
            hotel.id,
            hotel.name,
            hotel.city,
            hotel.state || null,
            hotel.destination || hotel.city,
            hotel.rating || 4.5,
            hotel.price,
            hotel.rooms,
            hotel.image,
            hotel.description || null,
            hotel.amenities || ["Free Wi-Fi", "Breakfast", "Air conditioning"],
            hotel.latitude || null,
            hotel.longitude || null
          ]
        );
      }
      // Reset serial sequence
      await client.query("SELECT setval(pg_get_serial_sequence('hotels', 'id'), coalesce(max(id), 1)) FROM hotels;");
    }

    // Seed rooms if table is empty
    const roomCountRes = await client.query("SELECT COUNT(*) FROM rooms");
    if (parseInt(roomCountRes.rows[0].count, 10) === 0) {
      console.log("[PostgreSQL] Seeding initial rooms...");
      for (const room of initialRooms) {
        await client.query(
          `INSERT INTO rooms (id, name, price, available, image, facilities)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [room.id, room.name, room.price, room.available, room.image, room.facilities]
        );
      }
      await client.query("SELECT setval(pg_get_serial_sequence('rooms', 'id'), coalesce(max(id), 1)) FROM rooms;");
    }

    
    const locCountRes = await client.query("SELECT COUNT(*) FROM locations");
    if (parseInt(locCountRes.rows[0].count, 10) === 0) {
      console.log("[PostgreSQL] Seeding initial locations...");
      for (const loc of hotelLocations) {
        await client.query(
          `INSERT INTO locations (state, cities) VALUES ($1, $2) ON CONFLICT (state) DO NOTHING`,
          [loc.state, JSON.stringify(loc.cities)]
        );
      }
    }

    
    const bookingCountRes = await client.query("SELECT COUNT(*) FROM bookings");
    if (parseInt(bookingCountRes.rows[0].count, 10) === 0) {
      console.log("[PostgreSQL] Seeding initial bookings...");
      for (const b of initialBookings) {
        await client.query(
          `INSERT INTO bookings (id, booking_id, full_name, email, phone, selected_hotel, selected_room, check_in, check_out, guests, payment_method, status, total_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (booking_id) DO NOTHING`,
          [
            b.id,
            b.booking_id,
            b.full_name,
            b.email,
            b.phone,
            b.selected_hotel,
            b.selected_room,
            b.check_in,
            b.check_out,
            b.guests,
            b.payment_method,
            b.status,
            b.total_price
          ]
        );
      }
      await client.query("SELECT setval(pg_get_serial_sequence('bookings', 'id'), coalesce(max(id), 1)) FROM bookings;");
    }

    return true;
  } catch (err) {
    console.error("[PostgreSQL Init Error]:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Connect to PostgreSQL
 */
export async function connectDB() {
  try {
    const testClient = await pool.connect();
    testClient.release();
    console.log("=================================================");
    console.log(" PostgreSQL Database Connected Successfully! ");
    console.log(` Host: ${process.env.PGHOST || "localhost"} | Database: ${process.env.PGDATABASE || "hotel_booking"}`);
    console.log("=================================================");
    await initializePostgres();
    return true;
  } catch (error) {
    console.error("[PostgreSQL Connection Error]:", error.message);
    throw error;
  }
}

export const db = {
  getStatus: () => ({
    mode: "PostgreSQL",
    connected: true,
    database: process.env.PGDATABASE || "hotel_booking",
    host: process.env.PGHOST || "localhost"
  }),
  query: async (text, params = []) => {
    return pool.query(text, params);
  }
};

export default db;
