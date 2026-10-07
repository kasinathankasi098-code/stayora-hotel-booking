import { useNavigate } from "react-router-dom";

function HotelCard({ hotel, text, onBook, onViewDetails, onEdit, onDelete }) {
  const navigate = useNavigate();

  const amenities = hotel.amenities || [
    text.freeWifi,
    text.breakfast,
    text.airConditioning
  ];

  function handleViewDetailsClick() {
    if (onViewDetails) {
      onViewDetails(hotel);
    } else {
      navigate(`/hotels/${hotel.id}`);
    }
  }

  function handleEditClick(e) {
    e.stopPropagation();
    if (onEdit) {
      onEdit(hotel);
    } else {
      navigate("/manage-hotels", { state: { editHotelId: hotel.id } });
    }
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    if (onDelete) {
      onDelete(hotel);
    }
  }

  return (
    <div className="hotel-card">
      <img src={hotel.image} alt={hotel.name} />
      <div className="hotel-card-badge">Popular</div>

      <div className="hotel-card-body">
        <h3>{hotel.name}</h3>
        <p>{text.city}: {hotel.city}</p>
        {hotel.state && <p>{text.state}: {hotel.state}</p>}
        <p>{text.rating}: {hotel.rating}</p>
        <p>{text.price}: ₹{hotel.price} / night</p>
        <p>{text.rooms}: {hotel.rooms}</p>
        <p className="hotel-description">{hotel.description || text.hotelCardDescription}</p>

        <div className="amenity-list">
          {amenities.map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>

        {hotel.latitude && hotel.longitude && (
          <div className="hotel-map" style={{ marginTop: "14px" }}>
            <iframe
              title={`${hotel.name} Map`}
              width="100%"
              height="150"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(hotel.longitude) - 0.01}%2C${Number(hotel.latitude) - 0.01}%2C${Number(hotel.longitude) + 0.01}%2C${Number(hotel.latitude) + 0.01}&layer=mapnik&marker=${hotel.latitude}%2C${hotel.longitude}`}
            ></iframe>
          </div>
        )}

        <div className="hotel-card-actions">
          <button className="secondary-btn" onClick={handleViewDetailsClick}>
            {text.viewDetails}
          </button>
          <button className="primary-btn" onClick={() => onBook(hotel)}>
            {text.bookNow}
          </button>
        </div>

        <div className="card-actions">
          <button className="small-btn edit-btn" onClick={handleEditClick}>
            {text.edit || "Edit"}
          </button>
          <button className="small-btn danger delete-btn" onClick={handleDeleteClick}>
            {text.delete || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
