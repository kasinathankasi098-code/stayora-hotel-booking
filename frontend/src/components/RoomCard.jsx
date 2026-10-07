function RoomCard({ room, text, onBook }) {
  return (
    <div className="room-card">
      <img src={room.image} alt={room.name} />

      <div className="room-card-body">
        <h3>{room.name}</h3>
        <p>{text.price}: ₹{room.price}</p>
        <p>{text.rooms}: {room.available}</p>
        <p>
          <strong>{text.roomFacilities}:</strong> {room.facilities.join(", ")}
        </p>

        <button className="primary-btn" onClick={() => onBook(room)}>
          {text.bookNow}
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
