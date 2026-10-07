import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import { getHotel, getRooms, deleteHotel } from "../services/api";
import { translations } from "../languages/translations";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const language = localStorage.getItem("language") || "English";
  const text = translations[language] || translations.English;

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHotelDetails() {
      setLoading(true);
      setError(null);
      try {
        const response = await getHotel(id);
        if (response && response.data) {
          setHotel(response.data);
          document.title = `${response.data.name} - ${text.appName}`;

          try {
            const roomsResponse = await getRooms(response.data.id);
            if (roomsResponse && roomsResponse.data) {
              setRooms(roomsResponse.data);
            }
          } catch (roomErr) {
            console.warn("Could not load rooms:", roomErr);
          }
        } else {
          setError("Hotel not found");
        }
      } catch (err) {
        setError("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadHotelDetails();
    }
  }, [id, text.appName]);

  function handleBook() {
    if (!hotel) return;
    localStorage.setItem("selectedHotel", hotel.name);
    navigate("/register", { state: { hotelName: hotel.name } });
  }

  function handleEdit() {
    if (!hotel) return;
    navigate("/manage-hotels", { state: { editHotelId: hotel.id } });
  }

  async function handleDelete() {
    if (!hotel) return;
    const confirmed = window.confirm(`Are you sure you want to delete "${hotel.name}"?`);
    if (!confirmed) return;

    try {
      await deleteHotel(hotel.id);
      alert("Hotel deleted successfully.");
      navigate("/hotels");
    } catch (err) {
      alert("Failed to delete hotel: " + err.message);
    }
  }

  function handleRoomBook(room) {
    if (!hotel) return;
    localStorage.setItem("selectedHotel", hotel.name);
    localStorage.setItem("selectedRoom", room.name);
    navigate("/register", {
      state: {
        hotelName: hotel.name,
        roomName: room.name
      }
    });
  }

  const latitude = hotel && hotel.latitude ? Number(hotel.latitude) : null;
  const longitude = hotel && hotel.longitude ? Number(hotel.longitude) : null;
  const hasCoordinates = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

  return (
    <div className="page-shell">
      <Navbar />

      <div className="container hotel-details-container">
        <div className="details-nav-bar">
          <button className="secondary-btn" onClick={() => navigate("/hotels")}>
            ← Back to Hotels
          </button>
          <div className="action-buttons-cell">
            <button className="small-btn edit-btn" onClick={handleEdit}>
              Edit Hotel
            </button>
            <button className="small-btn danger delete-btn" onClick={handleDelete}>
              Delete Hotel
            </button>
            <button className="primary-btn" onClick={handleBook}>
              {text.bookNow}
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <p>Loading hotel details...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p className="danger-text">{error}</p>
            <button className="primary-btn" onClick={() => navigate("/hotels")}>
              View All Hotels
            </button>
          </div>
        )}

        {hotel && !loading && (
          <div className="hotel-details-content">
            <div className="details-hero">
              <div className="details-image-box">
                <img src={hotel.image} alt={hotel.name} className="details-main-image" />
                <div className="details-badge">★ {hotel.rating} / 5.0</div>
              </div>

              <div className="details-header-info">
                <h1>{hotel.name}</h1>
                <p className="details-location">
                  {hotel.city}
                  {hotel.state ? `, ${hotel.state}` : ""}
                  {hotel.destination && hotel.destination !== hotel.city && hotel.destination !== hotel.state
                    ? ` (${hotel.destination})`
                    : ""}
                </p>

                <div className="details-price-badge">
                  <span className="price-label">Price per night:</span>
                  <span className="price-amount">₹{hotel.price}</span>
                </div>

                <div className="details-stats">
                  <div className="stat-pill">
                    <strong>Rooms:</strong> {hotel.rooms} Available
                  </div>
                  <div className="stat-pill">
                    <strong>Rating:</strong> {hotel.rating} / 5
                  </div>
                  {hasCoordinates && (
                    <div className="stat-pill">
                      <strong>GPS:</strong> {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
                    </div>
                  )}
                </div>

                <p className="details-description">
                  {hotel.description || text.hotelCardDescription}
                </p>

                <div className="details-amenities">
                  <h3>Amenities & Perks</h3>
                  <div className="amenity-list">
                    {(hotel.amenities && hotel.amenities.length > 0
                      ? hotel.amenities
                      : [text.freeWifi, text.breakfast, text.airConditioning]
                    ).map((amenity) => (
                      <span key={amenity} className="amenity-tag">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="details-action-row">
                  <button className="primary-btn big-btn" onClick={handleBook}>
                    Book {hotel.name}
                  </button>
                  <button className="secondary-btn" onClick={handleEdit}>
                    Edit Hotel
                  </button>
                  <button className="small-btn danger" onClick={handleDelete}>
                    Delete Hotel
                  </button>
                </div>
              </div>
            </div>

            <section className="hotel-map-section">
              <div className="section-header">
                <h2>Hotel Location & Map</h2>
              </div>
              <div className="map-card">
                <div className="coordinates-bar">
                  <span><strong>City:</strong> {hotel.city}</span>
                  <span><strong>State:</strong> {hotel.state || "Kerala"}</span>
                  {hasCoordinates ? (
                    <span>
                      <strong>Coordinates:</strong> Latitude: {latitude}, Longitude: {longitude}
                    </span>
                  ) : (
                    <span>Coordinates not yet set</span>
                  )}
                </div>

                {hasCoordinates ? (
                  <div className="map-frame-wrapper">
                    <iframe
                      title={`${hotel.name} OpenStreetMap`}
                      width="100%"
                      height="380"
                      style={{ border: 0, borderRadius: "10px" }}
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.015}%2C${latitude - 0.015}%2C${longitude + 0.015}%2C${latitude + 0.015}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                    ></iframe>
                    <div className="map-attribution">
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        Open in OpenStreetMap ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="no-map-notice">
                    <p>Map coordinates are not specified for this hotel.</p>
                  </div>
                )}
              </div>
            </section>

            {rooms.length > 0 && (
              <section className="selected-hotel-rooms">
                <div className="section-header room-header">
                  <h2>Available Room Options</h2>
                </div>
                <div className="room-grid">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      text={text}
                      onBook={handleRoomBook}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelDetails;
