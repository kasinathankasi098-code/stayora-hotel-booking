import dotenv from "dotenv";
import pkg from "pg";
import {
  hotelLocations,
  initialHotels,
  initialRooms,
  initialBookings
} from "./initialData.js";

dotenv.config();
const { Pool } = pkg;

async function seedData() {
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
    console.log("[Seeder] Connecting to PostgreSQL database...");
    const client = await pool.connect();

    console.log("[Seeder] Seeding hotels...");
    for (const h of initialHotels) {
      await client.query(
        `INSERT INTO hotels (id, name, city, state, destination, rating, price, rooms, image, description, amenities)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           city = EXCLUDED.city,
           state = EXCLUDED.state,
           destination = EXCLUDED.destination,
           rating = EXCLUDED.rating,
           price = EXCLUDED.price,
           rooms = EXCLUDED.rooms,
           image = EXCLUDED.image,
           description = EXCLUDED.description,
           amenities = EXCLUDED.amenities`,
        [
          h.id,
          h.name,
          h.city,
          h.state || null,
          h.destination || h.city,
          h.rating,
          h.price,
          h.rooms,
          h.image,
          h.description,
          h.amenities
        ]
      );
    }
    await client.query("SELECT setval(pg_get_serial_sequence('hotels', 'id'), coalesce(max(id), 1)) FROM hotels;");

    console.log("[Seeder] Seeding rooms...");
    for (const r of initialRooms) {
      await client.query(
        `INSERT INTO rooms (id, name, price, available, image, facilities)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           price = EXCLUDED.price,
           available = EXCLUDED.available,
           image = EXCLUDED.image,
           facilities = EXCLUDED.facilities`,
        [r.id, r.name, r.price, r.available, r.image, r.facilities]
      );
    }
    await client.query("SELECT setval(pg_get_serial_sequence('rooms', 'id'), coalesce(max(id), 1)) FROM rooms;");

    console.log("[Seeder] Seeding locations...");
    for (const loc of hotelLocations) {
      await client.query(
        `INSERT INTO locations (state, cities) VALUES ($1, $2)
         ON CONFLICT (state) DO UPDATE SET cities = EXCLUDED.cities`,
        [loc.state, loc.cities]
      );
    }

    console.log("[Seeder] Seeding sample bookings...");
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

    console.log(" PostgreSQL database seeded successfully with hotels, rooms, locations, and bookings!");
    client.release();
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  } finally {
    await pool.end();
  }
}

seedData();
