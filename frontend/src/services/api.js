const API_BASE = "/api";

/**
 * Helper to make API requests with fallback
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`[API] Call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// ---------------- Hotel API Endpoints ----------------
export async function getHotels(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.city) query.append("city", params.city);
  if (params.destination) query.append("destination", params.destination);
  if (params.state) query.append("state", params.state);

  const qs = query.toString();
  return request(`/hotels${qs ? `?${qs}` : ""}`);
}

export async function getHotel(id) {
  return request(`/hotels/${id}`);
}

export async function createHotel(hotelData) {
  return request("/hotels", {
    method: "POST",
    body: JSON.stringify(hotelData)
  });
}

export async function updateHotel(id, hotelData) {
  return request(`/hotels/${id}`, {
    method: "PUT",
    body: JSON.stringify(hotelData)
  });
}

export async function deleteHotel(id) {
  return request(`/hotels/${id}`, {
    method: "DELETE"
  });
}

// ---------------- Booking API Endpoints ----------------
export async function getBookings(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.email) query.append("email", params.email);
  if (params.hotel) query.append("hotel", params.hotel);
  if (params.status) query.append("status", params.status);

  const qs = query.toString();
  return request(`/bookings${qs ? `?${qs}` : ""}`);
}

export async function getBooking(id) {
  return request(`/bookings/${id}`);
}

export async function createBooking(bookingData) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData)
  });
}

export async function updateBooking(id, bookingData) {
  return request(`/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookingData)
  });
}

export async function deleteBooking(id) {
  return request(`/bookings/${id}`, {
    method: "DELETE"
  });
}

// ---------------- Rooms & Locations ----------------
export async function getRooms(hotelId) {
  return request(`/rooms${hotelId ? `?hotelId=${hotelId}` : ""}`);
}

export async function getLocations() {
  return request("/locations");
}

export async function getDestinations() {
  return request("/locations/destinations");
}

export async function getHealth() {
  return request("/health");
}
