import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { translations } from "../languages/translations";
import { createBooking, getRooms } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const language = localStorage.getItem("language") || "English";
  const text = translations[language] || translations.English;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(location.state?.hotelName || "");
  const [selectedRoom, setSelectedRoom] = useState(location.state?.roomName || "Standard Room");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [rooms, setRooms] = useState([
    "Standard Room",
    "Deluxe Room",
    "Family Room",
    "Suite Room"
  ]);

  useEffect(() => {
    document.title = text.appName;
    async function fetchRooms() {
      try {
        const res = await getRooms();
        if (res && res.data && res.data.length > 0) {
          setRooms(res.data.map((r) => r.name));
        }
      } catch (err) {
        console.warn("Could not load rooms:", err);
      }
    }
    fetchRooms();
  }, [text.appName]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!fullName || !email || !phone || !selectedHotel || !checkIn || !checkOut) {
      alert(text.fillAll || "Please fill all required fields.");
      return;
    }

    const newBooking = {
      fullName: fullName,
      email: email,
      phone: phone,
      selectedHotel: selectedHotel,
      selectedRoom: selectedRoom,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      paymentMethod: paymentMethod,
      bookingId: `STAY-${Date.now()}`
    };

    try {
      const res = await createBooking(newBooking);
      const savedBooking = res?.data || newBooking;
      localStorage.setItem("booking", JSON.stringify(savedBooking));
      navigate("/confirmation");
    } catch (err) {
      localStorage.setItem("booking", JSON.stringify(newBooking));
      navigate("/confirmation");
    }
  }

  return (
    <div className="page-shell">
      <Navbar />

      <div className="container form-container">
        <div className="booking-layout">
          <form className="booking-form" onSubmit={handleSubmit}>
            <h2>{text.confirmBooking}</h2>

            <label>{text.fullName}</label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>{text.email}</label>
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>{text.phone}</label>
            <input
              type="tel"
              required
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label>{text.selectedHotel}</label>
            <input
              type="text"
              required
              placeholder="Hotel name"
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            />

            <label>{text.selectedRoom}</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((roomName) => (
                <option key={roomName} value={roomName}>
                  {roomName}
                </option>
              ))}
            </select>

            <label>{text.checkIn}</label>
            <input
              type="date"
              required
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />

            <label>{text.checkOut}</label>
            <input
              type="date"
              required
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

            <label>{text.guests}</label>
            <input
              type="number"
              min="1"
              required
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />

            <label>{text.paymentMethod}</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash on Arrival">Cash on Arrival</option>
            </select>

            <button type="submit" className="primary-btn full-width">
              {text.confirmBooking}
            </button>
          </form>

          <div className="summary-card">
            <h3>{text.bookingSummary}</h3>
            <p><strong>{text.selectedHotel}:</strong> {selectedHotel || "-"}</p>
            <p><strong>{text.selectedRoom}:</strong> {selectedRoom || "-"}</p>
            <p><strong>{text.checkIn}:</strong> {checkIn || "-"}</p>
            <p><strong>{text.checkOut}:</strong> {checkOut || "-"}</p>
            <p><strong>{text.guests}:</strong> {guests || "-"}</p>
            <p><strong>{text.paymentMethod}:</strong> {paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;