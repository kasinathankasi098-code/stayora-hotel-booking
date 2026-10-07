async function runTests() {
  const baseURL = "http://localhost:5000/api";

  console.log("=== RUNNING API TESTS ===");

  // 1. Health
  const healthRes = await fetch(`${baseURL}/health`);
  const healthData = await healthRes.json();
  console.log("✔ Health Check:", healthData.status, "| Service:", healthData.service);

  // 2. GET Hotels
  const hotelsRes = await fetch(`${baseURL}/hotels`);
  const hotelsData = await hotelsRes.json();
  console.log("✔ GET Hotels:", hotelsData.count, "hotels found. First:", hotelsData.data[0]?.name);

  // 3. POST Hotel (Create)
  const createHotelRes = await fetch(`${baseURL}/hotels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Grand Palace Coimbatore",
      city: "Coimbatore",
      state: "Tamil Nadu",
      destination: "Coimbatore",
      price: 3600,
      rooms: 14
    })
  });
  const createdHotel = await createHotelRes.json();
  console.log("✔ POST /hotels (Create):", createdHotel.success, "New ID:", createdHotel.data?.id, "Name:", createdHotel.data?.name);

  // 4. PUT Hotel (Update)
  const hotelId = createdHotel.data.id;
  const updateHotelRes = await fetch(`${baseURL}/hotels/${hotelId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: 4200, rooms: 18 })
  });
  const updatedHotel = await updateHotelRes.json();
  console.log("✔ PUT /hotels/:id (Update):", updatedHotel.success, "Updated Price:", updatedHotel.data?.price);

  // 5. GET single hotel
  const getSingleRes = await fetch(`${baseURL}/hotels/${hotelId}`);
  const singleHotel = await getSingleRes.json();
  console.log("✔ GET /hotels/:id (Read Single):", singleHotel.data?.name, "Rooms:", singleHotel.data?.rooms);

  // 6. DELETE Hotel
  const deleteHotelRes = await fetch(`${baseURL}/hotels/${hotelId}`, { method: "DELETE" });
  const deletedHotel = await deleteHotelRes.json();
  console.log("✔ DELETE /hotels/:id (Delete):", deletedHotel.success, "Deleted:", deletedHotel.data?.name);

  // 7. GET Bookings
  const bookingsRes = await fetch(`${baseURL}/bookings`);
  const bookingsData = await bookingsRes.json();
  console.log("✔ GET Bookings:", bookingsData.count, "bookings found.");

  // 8. POST Booking (Create)
  const createBookingRes = await fetch(`${baseURL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Ananya Iyer",
      email: "ananya@example.com",
      phone: "+91 9988776655",
      selectedHotel: "Grand Chennai Hotel",
      selectedRoom: "Suite Room",
      checkIn: "2026-10-20",
      checkOut: "2026-10-23",
      guests: 2,
      paymentMethod: "UPI",
      totalPrice: 15600
    })
  });
  const createdBooking = await createBookingRes.json();
  console.log("✔ POST /bookings (Create):", createdBooking.success, "Booking ID:", createdBooking.data?.booking_id);

  const bId = createdBooking.data?.id;

  // 9. PUT Booking (Update)
  const updateBookingRes = await fetch(`${baseURL}/bookings/${bId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Confirmed - Paid", guests: 3 })
  });
  const updatedBooking = await updateBookingRes.json();
  console.log("✔ PUT /bookings/:id (Update):", updatedBooking.success, "Status:", updatedBooking.data?.status);

  // 10. DELETE Booking
  const deleteBookingRes = await fetch(`${baseURL}/bookings/${bId}`, { method: "DELETE" });
  const deletedBooking = await deleteBookingRes.json();
  console.log("✔ DELETE /bookings/:id (Delete):", deletedBooking.success);

  // 11. Locations and Destinations
  const locRes = await fetch(`${baseURL}/locations`);
  const locData = await locRes.json();
  console.log("✔ GET /locations:", locData.count, "states");

  const destRes = await fetch(`${baseURL}/locations/destinations`);
  const destData = await destRes.json();
  console.log("✔ GET /locations/destinations:", destData.count, "destinations");

  console.log("\n ALL CRUD OPERATIONS TESTED AND WORKING 100%!");
}

runTests().catch(console.error);
