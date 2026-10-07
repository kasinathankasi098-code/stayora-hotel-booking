import db from "../config/db.js";

export async function addDestinationsAndHotels() {
  try {
    console.log("Adding destinations (Tamil Nadu, Goa, Karnataka) and related hotels...");

    // 1. Ensure locations exist in database
    const locationsToInsert = [
      { state: "Tamil Nadu", cities: ["Chennai", "Ooty", "Coimbatore", "Madurai"] },
      { state: "Goa", cities: ["Goa", "North Goa", "South Goa"] },
      { state: "Karnataka", cities: ["Bengaluru", "Mysuru"] }
    ];

    for (const loc of locationsToInsert) {
      const check = await db.query("SELECT id FROM locations WHERE state = $1", [loc.state]);
      if (check.rows.length === 0) {
        await db.query("INSERT INTO locations (state, cities) VALUES ($1, $2)", [loc.state, loc.cities]);
        console.log(`Inserted location: ${loc.state}`);
      } else {
        await db.query("UPDATE locations SET cities = $1 WHERE state = $2", [loc.cities, loc.state]);
        console.log(`Updated location: ${loc.state}`);
      }
    }

    // 2. Hotels to insert with coordinates
    const hotelsToAdd = [
      {
        name: "Grand Chennai Palace",
        city: "Chennai",
        state: "Tamil Nadu",
        destination: "Tamil Nadu",
        price: 3800,
        rooms: 16,
        rating: 4.8,
        latitude: 13.082680,
        longitude: 80.270718,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        description: "Luxury stay in central Chennai offering refined coastal architecture, multi-cuisine dining, and rooftop pool.",
        amenities: ["Free Wi-Fi", "Breakfast", "Swimming Pool", "Air conditioning", "Fitness Center"]
      },
      {
        name: "Ooty Misty Hills Resort",
        city: "Ooty",
        state: "Tamil Nadu",
        destination: "Tamil Nadu",
        price: 4200,
        rooms: 12,
        rating: 4.7,
        latitude: 11.410000,
        longitude: 76.695000,
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
        description: "Scenic hillside resort in the Nilgiri hills surrounded by tea gardens and misty mountain views.",
        amenities: ["Free Wi-Fi", "Breakfast", "Mountain View", "Fireplace", "Spa"]
      },
      {
        name: "Palm Shore Beach Resort",
        city: "Goa",
        state: "Goa",
        destination: "Goa",
        price: 4500,
        rooms: 20,
        rating: 4.9,
        latitude: 15.543940,
        longitude: 73.755330,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        description: "Direct beach access with private cabanas, tropical gardens, and oceanfront dining in Goa.",
        amenities: ["Free Wi-Fi", "Breakfast", "Beachfront", "Swimming Pool", "Bar"]
      },
      {
        name: "Goa Coastal Serenity Villa",
        city: "Goa",
        state: "Goa",
        destination: "Goa",
        price: 3900,
        rooms: 10,
        rating: 4.6,
        latitude: 15.278500,
        longitude: 73.916800,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        description: "Peaceful coastal retreat surrounded by swaying coconut palms and serene white-sand beaches.",
        amenities: ["Free Wi-Fi", "Breakfast", "Air conditioning", "Bicycle Rental"]
      },
      {
        name: "Bengaluru Royal Palace Hotel",
        city: "Bengaluru",
        state: "Karnataka",
        destination: "Karnataka",
        price: 4900,
        rooms: 22,
        rating: 4.8,
        latitude: 12.971599,
        longitude: 77.594566,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        description: "Opulent urban sanctuary in the Silicon Valley of India with lavish suites and fine dining.",
        amenities: ["Free Wi-Fi", "Breakfast", "Air conditioning", "Spa", "Business Center"]
      }
    ];

    for (const h of hotelsToAdd) {
      const check = await db.query("SELECT id FROM hotels WHERE name = $1", [h.name]);
      if (check.rows.length === 0) {
        await db.query(`
          INSERT INTO hotels (name, city, state, destination, price, rooms, rating, latitude, longitude, image, description, amenities)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          h.name,
          h.city,
          h.state,
          h.destination,
          h.price,
          h.rooms,
          h.rating,
          h.latitude,
          h.longitude,
          h.image,
          h.description,
          h.amenities
        ]);
        console.log(`Inserted hotel: ${h.name} (${h.destination})`);
      } else {
        await db.query(`
          UPDATE hotels 
          SET city = $1, state = $2, destination = $3, price = $4, rooms = $5, rating = $6, latitude = $7, longitude = $8, image = $9, description = $10, amenities = $11
          WHERE name = $12
        `, [
          h.city,
          h.state,
          h.destination,
          h.price,
          h.rooms,
          h.rating,
          h.latitude,
          h.longitude,
          h.image,
          h.description,
          h.amenities,
          h.name
        ]);
        console.log(`Updated hotel: ${h.name}`);
      }
    }

    const currentHotels = await db.query("SELECT id, name, city, state, destination, latitude, longitude FROM hotels ORDER BY id ASC");
    console.log("Current hotels in database:", currentHotels.rows);

    const destinations = await db.query("SELECT DISTINCT destination FROM hotels ORDER BY destination ASC");
    console.log("Available destinations:", destinations.rows.map(r => r.destination));

    return true;
  } catch (error) {
    console.error("Error adding destinations and hotels:", error);
    throw error;
  }
}

if (process.argv[1] && process.argv[1].includes("seedDestinationsAndHotels.js")) {
  addDestinationsAndHotels().then(() => process.exit(0)).catch(() => process.exit(1));
}
