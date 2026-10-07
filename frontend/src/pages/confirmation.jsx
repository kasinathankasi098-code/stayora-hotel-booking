import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { translations } from "../languages/translations";

function Confirmation() {
  const navigate = useNavigate();
  const language = localStorage.getItem("language") || "English";
  const text = translations[language] || translations.English;
  const booking = JSON.parse(localStorage.getItem("booking") || "null");

  return (
    <div className="page-shell">
      <Navbar />

      <div className="container confirmation-box">
        <h2>{text.bookingConfirmed}</h2>
        <p className="confirmation-text">{text.thankYou}</p>

        {booking ? (
          <div className="confirmation-details">
            <p><strong>{text.customerName}:</strong> {booking.fullName || booking.full_name}</p>
            <p><strong>{text.email}:</strong> {booking.email}</p>
            <p><strong>{text.phone}:</strong> {booking.phone}</p>
            <p><strong>{text.hotelNameLabel}:</strong> {booking.selectedHotel || booking.selected_hotel}</p>
            <p><strong>{text.roomType}:</strong> {booking.selectedRoom || booking.selected_room}</p>
            <p><strong>{text.checkIn}:</strong> {booking.checkIn || booking.check_in}</p>
            <p><strong>{text.checkOut}:</strong> {booking.checkOut || booking.check_out}</p>
            <p><strong>{text.guests}:</strong> {booking.guests}</p>
            <p><strong>{text.paymentLabel}:</strong> {booking.paymentMethod || booking.payment_method}</p>
            <p><strong>{text.bookingId}:</strong> {booking.bookingId || booking.booking_id}</p>
          </div>
        ) : (
          <p>No booking found.</p>
        )}

        <div className="confirmation-actions">
          <button className="primary-btn" onClick={() => navigate("/bookings")}>{text.myBookings || "View All Bookings"}</button>
          <button className="secondary-btn" onClick={() => navigate("/hotels")}>{text.bookAnother}</button>
          <button className="secondary-btn" onClick={() => navigate("/home")}>{text.backHome}</button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;