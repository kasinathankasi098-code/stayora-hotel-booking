import db from "../config/db.js";

export const LocationModel = {
  async findAll() {
    const result = await db.query("SELECT * FROM locations ORDER BY state ASC");
    return result.rows;
  },

  async getDestinations() {
    const result = await db.query(
      "SELECT DISTINCT destination FROM hotels WHERE destination IS NOT NULL AND destination != ''"
    );
    if (result.rows.length === 0) {
      return ["Kerala"];
    }
    return result.rows.map(r => r.destination);
  }
};
