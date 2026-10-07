import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { translations } from "../languages/translations";
import { getBookings, deleteBooking, updateBooking } from "../services/api";

function Bookings() {
  const navigate = useNavigate();
  const language = localStorage.getItem("language") || "English";
  const text = translations[language] || translations.English;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    document.title = `${text.appName} - Bookings`;
    loadBookings();
  }, [text.appName]);

  async function loadBookings() {
    setLoading(true);
    try {
      const response = await getBookings();
      if (response && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      const localBooking = localStorage.getItem("booking");
      if (localBooking) {
        setBookings([JSON.parse(localBooking)]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      await deleteBooking(id);
      setBookings(bookings.filter((item) => item.id !== id && item.booking_id !== id));
      alert("Booking cancelled successfully.");
    } catch (error) {
      alert("Could not cancel booking: " + error.message);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const response = await updateBooking(id, { status: newStatus });
      if (response && response.data) {
        setBookings(
          bookings.map((item) => {
            if (item.id === id || item.booking_id === id) {
              return response.data;
            }
            return item;
          })
        );
      }
    } catch (error) {
      alert("Could not update status: " + error.message);
    }
  }

  const filteredBookings = bookings.filter((item) => {
    const keyword = search.toLowerCase();
    const guestName = (item.fullName || item.full_name || "").toLowerCase();
    const hotelName = (item.selectedHotel || item.selected_hotel || "").toLowerCase();
    const bookingCode = (item.bookingId || item.booking_id || "").toLowerCase();

    const matchesSearch =
      guestName.includes(keyword) ||
      hotelName.includes(keyword) ||
      bookingCode.includes(keyword);

    const matchesStatus =
      statusFilter === "" ||
      (item.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-shell">
      <Navbar />

      <div className="container" style={{ padding: "40px 0" }}>
        <div className="section-header" style={{ marginBottom: "24px" }}>
          <h2>{text.allBookings || "All Bookings"}</h2>
          <p className="subtitle">Manage reservations and view booking status.</p>
        </div>

        <div className="search-section" style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by guest, hotel, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "220px" }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>

          <button className="primary-btn" onClick={loadBookings}>
            Refresh
          </button>
        </div>

        {loading && <p className="loading-state">Loading bookings...</p>}

        {!loading && filteredBookings.length === 0 && (
          <div className="empty-state">
            <p>{text.noBookingsFound || "No bookings found."}</p>
            <button className="primary-btn" style={{ marginTop: "16px" }} onClick={() => navigate("/hotels")}>
              Book a Hotel
            </button>
          </div>
        )}

        {!loading && (
          <div style={{ display: "grid", gap: "18px" }}>
            {filteredBookings.map((item) => {
              const bookingKey = item.id || item.booking_id;
              const isCancelled = (item.status || "").toLowerCase() === "cancelled";

              return (
                <div
                  key={bookingKey}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dbe6ef",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <h3 style={{ margin: 0, color: "#11658f" }}>
                        {item.selectedHotel || item.selected_hotel}
                      </h3>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          backgroundColor: isCancelled ? "#ffebee" : "#e8f5e9",
                          color: isCancelled ? "#c62828" : "#2e7d32"
                        }}
                      >
                        {item.status || "Confirmed"}
                      </span>
                    </div>

                    <p style={{ margin: "4px 0", color: "#444" }}>
                      <strong>Booking ID:</strong> {item.bookingId || item.booking_id}
                    </p>
                    <p style={{ margin: "4px 0", color: "#444" }}>
                      <strong>Guest:</strong> {item.fullName || item.full_name} ({item.email}) | {item.phone}
                    </p>
                    <p style={{ margin: "4px 0", color: "#444" }}>
                      <strong>Room:</strong> {item.selectedRoom || item.selected_room} | <strong>Guests:</strong> {item.guests}
                    </p>
                    <p style={{ margin: "4px 0", color: "#444" }}>
                      <strong>Dates:</strong> {item.checkIn || item.check_in} to {item.checkOut || item.check_out}
                    </p>
                    <p style={{ margin: "4px 0", color: "#444" }}>
                      <strong>Payment:</strong> {item.paymentMethod || item.payment_method}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
                    <select
                      value={item.status || "Confirmed"}
                      onChange={(e) => handleStatusChange(bookingKey, e.target.value)}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                      <option value="Confirmed">Mark Confirmed</option>
                      <option value="Completed">Mark Completed</option>
                      <option value="Cancelled">Mark Cancelled</option>
                    </select>

                    <button className="small-btn danger" onClick={() => handleDelete(bookingKey)}>
                      Cancel & Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
