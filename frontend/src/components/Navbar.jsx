import { useNavigate } from "react-router-dom";
import { translations } from "../languages/translations";

function Navbar() {
  const navigate = useNavigate();
  const text = translations[localStorage.getItem("language") || "English"] || translations.English;

  const links = [
    { label: text.home, path: "/home" },
    { label: text.hotels, path: "/hotels" },
    { label: text.manageHotels, path: "/manage-hotels" },
    { label: text.myBookings || "My Bookings", path: "/bookings" }
  ];

  return (
    <nav className="navbar">
      <button className="logo" onClick={() => navigate("/home")}>
        {text.appName}
      </button>
      <div className="nav-links">
        {links.map((link) => (
          <button key={link.path} className="nav-btn" onClick={() => navigate(link.path)}>
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
