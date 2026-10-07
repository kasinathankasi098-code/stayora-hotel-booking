import db from "../config/db.js";

export const RoomModel = {
  async findAll({ hotelId } = {}) {
    let query = "SELECT * FROM rooms";
    const params = [];
    if (hotelId) {
      query += " WHERE hotel_id = $1";
      params.push(parseInt(hotelId, 10));
    }
    query += " ORDER BY id ASC";
    const result = await db.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    const result = await db.query("SELECT * FROM rooms WHERE id = $1", [numId]);
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      hotel_id = null,
      name,
      price,
      available = 5,
      image = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      facilities = ["Wi-Fi", "Breakfast", "AC"]
    } = data;

    const query = `
      INSERT INTO rooms (hotel_id, name, price, available, image, facilities, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [
      hotel_id ? parseInt(hotel_id, 10) : null,
      name,
      parseFloat(price),
      parseInt(available, 10),
      image,
      facilities
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async update(id, data) {
    const numId = parseInt(id, 10);
    const current = await this.findById(numId);
    if (!current) return null;

    const name = data.name !== undefined ? data.name : current.name;
    const price = data.price !== undefined ? parseFloat(data.price) : current.price;
    const available = data.available !== undefined ? parseInt(data.available, 10) : current.available;
    const image = data.image !== undefined ? data.image : current.image;
    const facilities = data.facilities !== undefined ? data.facilities : current.facilities;

    const query = `
      UPDATE rooms
      SET name = $1, price = $2, available = $3, image = $4, facilities = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const result = await db.query(query, [name, price, available, image, facilities, numId]);
    return result.rows[0];
  },

  async delete(id) {
    const numId = parseInt(id, 10);
    const result = await db.query("DELETE FROM rooms WHERE id = $1 RETURNING *", [numId]);
    return result.rows[0] || null;
  }
};
