import db from "../config/db.js";

export async function runMigration() {
  try {
    console.log("Running migration and data cleanup...");
    // 1. Ensure latitude and longitude columns exist
    await db.query(`
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6);
      ALTER TABLE hotels ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6);
    `);

    // 2. Delete unwanted hotels - keep only Kerala Heritage Resort
    await db.query(`DELETE FROM hotels WHERE name != 'Kerala Heritage Resort'`);

    // 3. Ensure Kerala Heritage Resort exists with latitude and longitude
    const existing = await db.query(`SELECT * FROM hotels WHERE name = 'Kerala Heritage Resort'`);
    if (existing.rows.length === 0) {
      await db.query(`
        INSERT INTO hotels (name, city, state, destination, rating, price, rooms, image, description, amenities, latitude, longitude)
        VALUES (
          'Kerala Heritage Resort',
          'Kochi',
          'Kerala',
          'Kerala',
          4.8,
          3200,
          14,
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          'Surrounded by lush heritage gardens and fresh spice aromas, Kerala Heritage Resort offers serene backwaters and authentic Kerala architecture.',
          ARRAY['Free Wi-Fi', 'Breakfast', 'Heritage Walk', 'Swimming Pool', 'Air conditioning']::TEXT[],
          9.965628,
          76.242104
        )
      `);
    } else {
      await db.query(`
        UPDATE hotels 
        SET latitude = 9.965628, 
            longitude = 76.242104, 
            city = 'Kochi', 
            state = 'Kerala', 
            destination = 'Kerala',
            price = 3200,
            rooms = 14,
            rating = 4.8,
            image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            description = 'Surrounded by lush heritage gardens and fresh spice aromas, Kerala Heritage Resort offers serene backwaters and authentic Kerala architecture.'
        WHERE name = 'Kerala Heritage Resort'
      `);
    }

    // 4. Delete unwanted locations - keep only Kerala (Kochi)
    await db.query(`DELETE FROM locations WHERE state != 'Kerala'`);
    const locExisting = await db.query(`SELECT * FROM locations WHERE state = 'Kerala'`);
    if (locExisting.rows.length === 0) {
      await db.query(`INSERT INTO locations (state, cities) VALUES ('Kerala', '{"Kochi"}')`);
    } else {
      await db.query(`UPDATE locations SET cities = '{"Kochi"}' WHERE state = 'Kerala'`);
    }

    // 5. Update bookings to reference Kerala Heritage Resort
    await db.query(`UPDATE bookings SET selected_hotel = 'Kerala Heritage Resort' WHERE selected_hotel != 'Kerala Heritage Resort'`);

    // Reset sequence for hotels
    await db.query(`SELECT setval(pg_get_serial_sequence('hotels', 'id'), coalesce(max(id), 1)) FROM hotels;`);

    console.log("Migration and data cleanup completed successfully.");
    const currentHotels = await db.query("SELECT id, name, city, state, destination, latitude, longitude FROM hotels");
    console.log("Hotels:", currentHotels.rows);
    return true;
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
}

if (process.argv[1] && process.argv[1].includes("migrateAndClean.js")) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}
