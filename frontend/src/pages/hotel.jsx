import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HotelCard from "../components/HotelCard";
import RoomCard from "../components/RoomCard";
import { translations } from "../languages/translations";
import { getHotels, getRooms, deleteHotel } from "../services/api";

function Hotels() {
  const navigate = useNavigate();
  const location = useLocation();

  const language = localStorage.getItem("language") || "English";
  const text = translations[language] || translations.English;

  const [hotels, setHotels] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [search, setSearch] = useState(location.state?.destination || "");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `${text.hotels} - ${text.appName}`;

    async function loadHotelsAndRooms() {
      setLoading(true);
      try {
        const hotelsResponse = await getHotels();
        if (hotelsResponse && hotelsResponse.data) {
          setHotels(hotelsResponse.data);
        }

        const roomsResponse = await getRooms();
        if (roomsResponse && roomsResponse.data) {
          setRoomsList(roomsResponse.data);
        }
      } catch (error) {
        console.warn("Could not load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHotelsAndRooms();
  }, [text.hotels, text.appName]);

  const filteredHotels = hotels.filter((hotel) => {
    const keyword = search.toLowerCase();
    const nameMatch = hotel.name.toLowerCase().includes(keyword);
    const cityMatch = hotel.city.toLowerCase().includes(keyword);
    return nameMatch || cityMatch;
  });

  function handleBook(hotel) {
    localStorage.setItem("selectedHotel", hotel.name);
    navigate("/register", { state: { hotelName: hotel.name } });
  }

  function handleViewDetails(hotel) {
    navigate(`/hotels/${hotel.id}`);
  }

  function handleEditHotel(hotel) {
    navigate("/manage-hotels", { state: { editHotelId: hotel.id } });
  }

  async function handleDeleteHotel(hotel) {
    const confirmed = window.confirm(`Are you sure you want to delete ${hotel.name}?`);
    if (!confirmed) return;

    try {
      await deleteHotel(hotel.id);
      setHotels(hotels.filter((h) => h.id !== hotel.id));
      alert("Hotel deleted successfully.");
    } catch (error) {
      alert("Failed to delete hotel: " + error.message);
    }
  }

  function handleRoomBook(room) {
    if (!selectedHotel) return;
    localStorage.setItem("selectedHotel", selectedHotel.name);
    localStorage.setItem("selectedRoom", room.name);
    navigate("/register", {
      state: {
        hotelName: selectedHotel.name,
        roomName: room.name
      }
    });
  }

  return (
    <div className="page-shell">
      <Navbar />

      <div className="container">
        <div className="section-header catalog-header">
          <div>
            <h2>{search ? `${text.hotelsIn} ${search}` : text.hotels}</h2>
            <p className="subtitle">Explore verified luxury resorts and boutique stays.</p>
          </div>
          <button
            className="secondary-btn"
            onClick={() => navigate("/manage-hotels")}
          >
            {text.manageHotels}
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder={text.searchHotel}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="primary-btn">{text.search}</button>
          {search && (
            <button className="secondary-btn" onClick={() => setSearch("")}>
              {text.showAllHotels}
            </button>
          )}
        </div>

        {loading && <p className="loading-state">Loading hotels...</p>}

        {!loading && (
          <div className="hotel-grid">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card-wrapper">
                <HotelCard
                  hotel={hotel}
                  text={text}
                  onBook={handleBook}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditHotel}
                  onDelete={handleDeleteHotel}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredHotels.length === 0 && (
          <div className="empty-state">
            <p>{text.hotelsNotFound}</p>
            {search && (
              <button className="secondary-btn" onClick={() => setSearch("")}>
                {text.showAllHotels}
              </button>
            )}
          </div>
        )}

        {selectedHotel && (
          <section className="selected-hotel-rooms">
            <div className="section-header room-header">
              <h2>{text.roomsIn} {selectedHotel.name}</h2>
            </div>

            <div className="room-grid">
              {roomsList.map((room) => (
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
    </div>
  );
}

export default Hotels;