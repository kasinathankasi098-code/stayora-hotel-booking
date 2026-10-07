import db from "../config/db.js";

export const BookingModel = {
  async findAll({ search, email, hotel, status } = {}) {
    let query = "SELECT * FROM bookings WHERE 1=1";
    const params = [];
    let index = 1;

    if (search) {
      query += ` AND (LOWER(full_name) LIKE $${index} OR LOWER(booking_id) LIKE $${index} OR LOWER(selected_hotel) LIKE $${index} OR LOWER(email) LIKE $${index})`;
      params.push(`%${search.toLowerCase()}%`);
      index++;
    }

    if (email) {
      query += ` AND LOWER(email) = $${index}`;
      params.push(email.toLowerCase());
      index++;
    }

    if (hotel) {
      query += ` AND LOWER(selected_hotel) LIKE $${index}`;
      params.push(`%${hotel.toLowerCase()}%`);
      index++;
    }

    if (status) {
      query += ` AND LOWER(status) = $${index}`;
      params.push(status.toLowerCase());
      index++;
    }

    query += " ORDER BY id DESC";
    const result = await db.query(query, params);
    return result.rows;
  },

  async findByIdOrBookingId(idOrCode) {
    const isNum = /^\d+$/.test(idOrCode);
    let query;
    let params;

    if (isNum) {
      query = "SELECT * FROM bookings WHERE id = $1 OR booking_id = $2";
      params = [parseInt(idOrCode, 10), String(idOrCode)];
    } else {
      query = "SELECT * FROM bookings WHERE booking_id = $1";
      params = [String(idOrCode)];
    }

    const result = await db.query(query, params);
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      booking_id,
      bookingId,
      full_name,
      fullName,
      email,
      phone,
      selected_hotel,
      selectedHotel,
      selected_room,
      selectedRoom,
      check_in,
      checkIn,
      check_out,
      checkOut,
      guests = 1,
      payment_method = "UPI",
      paymentMethod,
      status = "Confirmed",
      total_price,
      totalPrice
    } = data;

    const bId = booking_id || bookingId || `STAY-${Date.now()}`;
    const name = full_name || fullName;
    const hotel = selected_hotel || selectedHotel;
    const room = selected_room || selectedRoom;
    const cIn = check_in || checkIn;
    const cOut = check_out || checkOut;
    const pMethod = payment_method || paymentMethod || "UPI";
    const guestCount = parseInt(guests, 10) || 1;
    const price = parseFloat(total_price || totalPrice || 0);

    const query = `
      INSERT INTO bookings (
        booking_id, full_name, email, phone, selected_hotel, selected_room,
        check_in, check_out, guests, payment_method, status, total_price, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [
      bId,
      name,
      email,
      phone,
      hotel,
      room,
      cIn,
      cOut,
      guestCount,
      pMethod,
      status,
      price
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async update(idOrCode, data) {
    const current = await this.findByIdOrBookingId(idOrCode);
    if (!current) return null;

    const name = data.full_name || data.fullName || current.full_name;
    const email = data.email !== undefined ? data.email : current.email;
    const phone = data.phone !== undefined ? data.phone : current.phone;
    const hotel = data.selected_hotel || data.selectedHotel || current.selected_hotel;
    const room = data.selected_room || data.selectedRoom || current.selected_room;
    const checkIn = data.check_in || data.checkIn || current.check_in;
    const checkOut = data.check_out || data.checkOut || current.check_out;
    const guests =
      data.guests !== undefined ? parseInt(data.guests, 10) : current.guests;
    const paymentMethod =
      data.payment_method || data.paymentMethod || current.payment_method;
    const status = data.status !== undefined ? data.status : current.status;
    const price =
      data.total_price !== undefined
        ? parseFloat(data.total_price)
        : data.totalPrice !== undefined
        ? parseFloat(data.totalPrice)
        : current.total_price;

    const query = `
      UPDATE bookings
      SET full_name = $1, email = $2, phone = $3, selected_hotel = $4, selected_room = $5,
          check_in = $6, check_out = $7, guests = $8, payment_method = $9, status = $10,
          total_price = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;
    const values = [
      name,
      email,
      phone,
      hotel,
      room,
      checkIn,
      checkOut,
      guests,
      paymentMethod,
      status,
      price,
      current.id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(idOrCode) {
    const isNum = /^\d+$/.test(idOrCode);
    const query = isNum
      ? "DELETE FROM bookings WHERE id = $1 OR booking_id = $2 RETURNING *"
      : "DELETE FROM bookings WHERE booking_id = $1 RETURNING *";
    const params = isNum
      ? [parseInt(idOrCode, 10), String(idOrCode)]
      : [String(idOrCode)];

    const result = await db.query(query, params);
    return result.rows[0] || null;
  }
};
