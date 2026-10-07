import db from "../config/db.js";

export const HotelModel = {
  async findAll({ search, city, destination, state, minPrice, maxPrice } = {}) {
    let query = "SELECT * FROM hotels WHERE 1=1";
    const params = [];
    let index = 1;

    if (search) {
      query += ` AND (LOWER(name) LIKE $${index} OR LOWER(city) LIKE $${index} OR LOWER(destination) LIKE $${index} OR LOWER(COALESCE(state, '')) LIKE $${index})`;
      params.push(`%${search.toLowerCase()}%`);
      index++;
    }

    if (city) {
      query += ` AND LOWER(city) = $${index}`;
      params.push(city.toLowerCase());
      index++;
    }

    if (destination) {
      query += ` AND (LOWER(destination) = $${index} OR LOWER(city) = $${index} OR LOWER(COALESCE(state, '')) = $${index})`;
      params.push(destination.toLowerCase());
      index++;
    }

    if (state) {
      query += ` AND LOWER(COALESCE(state, '')) = $${index}`;
      params.push(state.toLowerCase());
      index++;
    }

    if (minPrice) {
      query += ` AND price >= $${index}`;
      params.push(parseFloat(minPrice));
      index++;
    }

    if (maxPrice) {
      query += ` AND price <= $${index}`;
      params.push(parseFloat(maxPrice));
      index++;
    }

    query += " ORDER BY id ASC";
    const result = await db.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    const result = await db.query("SELECT * FROM hotels WHERE id = $1", [numId]);
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      name,
      city,
      state = null,
      destination = null,
      rating = 4.5,
      price,
      rooms,
      image = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      description = "",
      amenities = ["Free Wi-Fi", "Breakfast", "Air conditioning"],
      latitude = null,
      longitude = null
    } = data;

    const calcDestination = destination || (state === "Tamil Nadu" ? city : state || city);

    const query = `
      INSERT INTO hotels (name, city, state, destination, rating, price, rooms, image, description, amenities, latitude, longitude, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [
      name,
      city,
      state,
      calcDestination,
      parseFloat(rating) || 4.5,
      parseFloat(price),
      parseInt(rooms, 10),
      image,
      description,
      amenities,
      latitude,
      longitude
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async update(id, data) {
    const numId = parseInt(id, 10);
    const current = await this.findById(numId);
    if (!current) return null;

    const name = data.name !== undefined ? data.name : current.name;
    const city = data.city !== undefined ? data.city : current.city;
    const state = data.state !== undefined ? data.state : current.state;
    const destination =
      data.destination !== undefined
        ? data.destination
        : data.state || data.city
        ? (data.state === "Tamil Nadu" ? data.city || current.city : data.state || current.state)
        : current.destination;
    const rating = data.rating !== undefined ? parseFloat(data.rating) : current.rating;
    const price = data.price !== undefined ? parseFloat(data.price) : current.price;
    const rooms = data.rooms !== undefined ? parseInt(data.rooms, 10) : current.rooms;
    const image = data.image !== undefined ? data.image : current.image;
    const description = data.description !== undefined ? data.description : current.description;
    const amenities = data.amenities !== undefined ? data.amenities : current.amenities;
    const latitude = data.latitude !== undefined ? data.latitude : current.latitude;
    const longitude = data.longitude !== undefined ? data.longitude : current.longitude;

    const query = `
      UPDATE hotels
      SET name = $1, city = $2, state = $3, destination = $4, rating = $5, price = $6, rooms = $7, image = $8, description = $9, amenities = $10, latitude = $11, longitude = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `;
    const values = [
      name,
      city,
      state,
      destination,
      rating,
      price,
      rooms,
      image,
      description,
      amenities,
      latitude,
      longitude,
      numId
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const numId = parseInt(id, 10);
    const result = await db.query("DELETE FROM hotels WHERE id = $1 RETURNING *", [numId]);
    return result.rows[0] || null;
  }
};
