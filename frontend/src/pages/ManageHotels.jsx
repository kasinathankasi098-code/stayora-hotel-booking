import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getHotels, getLocations, createHotel, updateHotel, deleteHotel } from "../services/api";
import hotelExteriorImage from "../assets/images/hotel-exterior.jpg";

const emptyForm = {
  name: "", state: "Kerala", city: "Kochi", destination: "Kerala",
  price: "", rooms: "", rating: "4.5", description: "",
  latitude: "", longitude: "", image: "",
  amenities: "Free Wi-Fi, Breakfast, Air conditioning"
};

function ManageHotels() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hotels, setHotels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.editHotelId && hotels.length > 0) {
      const selected = hotels.find((h) => h.id === Number(location.state.editHotelId));
      if (selected) startEdit(selected);
    }
  }, [location.state, hotels]);

  async function loadData() {
    setLoading(true);
    try {
      const [hotelsRes, locsRes] = await Promise.all([getHotels(), getLocations()]);
      if (hotelsRes?.data) setHotels(hotelsRes.data);
      if (locsRes?.data) setLocations(locsRes.data);
    } catch {
      notify("Failed to load data from server", true);
    } finally {
      setLoading(false);
    }
  }

  function notify(text, isError = false) {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleStateChange(e) {
    const state = e.target.value;
    const loc = locations.find((l) => l.state === state);
    setFormData({ ...formData, state, city: loc?.cities?.[0] || "", destination: state });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image exceeds 5MB limit.");

    const reader = new FileReader();
    reader.onload = () => setFormData({ ...formData, image: reader.result });
    reader.readAsDataURL(file);
  }

  function startEdit(hotel) {
    setEditingId(hotel.id);
    setFormData({
      name: hotel.name,
      state: hotel.state || "",
      city: hotel.city || "",
      destination: hotel.destination || hotel.city || "",
      price: String(hotel.price),
      rooms: String(hotel.rooms),
      rating: String(hotel.rating || 4.5),
      description: hotel.description || "",
      latitude: hotel.latitude ? String(hotel.latitude) : "",
      longitude: hotel.longitude ? String(hotel.longitude) : "",
      image: hotel.image || "",
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities || ""
    });
    document.getElementById("hotel-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setFormData(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim() || !formData.price || !formData.rooms) {
      return alert("Please fill in hotel name, city, price, and rooms.");
    }

    const amenitiesList = typeof formData.amenities === "string"
      ? formData.amenities.split(",").map((a) => a.trim()).filter(Boolean)
      : formData.amenities;

    const payload = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      state: formData.state.trim() || null,
      destination: formData.destination.trim() || formData.city.trim(),
      price: Number(formData.price),
      rooms: Number(formData.rooms),
      rating: Number(formData.rating) || 4.5,
      description: formData.description.trim(),
      amenities: amenitiesList.length ? amenitiesList : ["Free Wi-Fi", "Breakfast", "Air conditioning"],
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      image: formData.image || hotelExteriorImage
    };

    try {
      if (editingId) {
        const res = await updateHotel(editingId, payload);
        if (res?.data) {
          setHotels(hotels.map((h) => (h.id === editingId ? res.data : h)));
          notify(`Hotel "${res.data.name}" updated!`);
        }
      } else {
        const res = await createHotel(payload);
        if (res?.data) {
          setHotels([...hotels, res.data]);
          notify(`Hotel "${res.data.name}" created!`);
        }
      }
      resetForm();
    } catch (err) {
      notify(`Save failed: ${err.message}`, true);
    }
  }

  async function handleDelete(hotel) {
    if (!window.confirm(`Delete "${hotel.name}"?`)) return;
    try {
      await deleteHotel(hotel.id);
      setHotels(hotels.filter((h) => h.id !== hotel.id));
      notify(`Hotel "${hotel.name}" deleted.`);
      if (editingId === hotel.id) resetForm();
    } catch (err) {
      notify(`Delete failed: ${err.message}`, true);
    }
  }

  const query = search.toLowerCase();
  const filteredHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(query) ||
    h.city.toLowerCase().includes(query) ||
    (h.state && h.state.toLowerCase().includes(query))
  );

  const cityOptions = locations.find((l) => l.state === formData.state)?.cities || [];

  return (
    <div className="page-shell">
      <Navbar />

      <div className="container manage-container">
        <div className="manage-header">
          <div>
            <h1>Hotel Management</h1>
            <p className="subtitle">Add, edit, view, and delete hotels.</p>
          </div>
          <button className="secondary-btn" onClick={() => navigate("/hotels")}>
            Browse Hotels &rarr;
          </button>
        </div>

        {message.text && (
          <div className={`alert-box ${message.isError ? "alert-error" : "alert-success"}`}>
            {message.text}
          </div>
        )}

        <section className="form-card" id="hotel-form">
          <div className="card-top-bar">
            <h2>{editingId ? "Edit Hotel" : "Add New Hotel"}</h2>
            {editingId && <button type="button" className="small-btn" onClick={resetForm}>Cancel Edit</button>}
          </div>

          <form onSubmit={handleSubmit} className="crud-form">
            <div className="form-grid">
              <label className="form-group">
                <span>Hotel Name *</span>
                <input type="text" name="name" required placeholder="Hotel name" value={formData.name} onChange={handleChange} />
              </label>

              <label className="form-group">
                <span>State</span>
                <select name="state" value={formData.state} onChange={handleStateChange}>
                  <option value="">Select State</option>
                  {locations.map((loc) => <option key={loc.id || loc.state} value={loc.state}>{loc.state}</option>)}
                </select>
              </label>

              <label className="form-group">
                <span>City *</span>
                {cityOptions.length > 0 ? (
                  <select name="city" value={formData.city} onChange={handleChange} required>
                    <option value="">Select City</option>
                    {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input type="text" name="city" required placeholder="City" value={formData.city} onChange={handleChange} />
                )}
              </label>

              <label className="form-group">
                <span>Destination Area</span>
                <input type="text" name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />
              </label>

              <label className="form-group">
                <span>Price per Night (₹) *</span>
                <input type="number" name="price" required min="1" placeholder="3200" value={formData.price} onChange={handleChange} />
              </label>

              <label className="form-group">
                <span>Available Rooms *</span>
                <input type="number" name="rooms" required min="0" placeholder="10" value={formData.rooms} onChange={handleChange} />
              </label>

              <label className="form-group">
                <span>Rating (1 - 5)</span>
                <input type="number" name="rating" min="1" max="5" step="0.1" placeholder="4.5" value={formData.rating} onChange={handleChange} />
              </label>

              <label className="form-group">
                <span>Latitude</span>
                <input type="number" name="latitude" step="any" placeholder="9.9656" value={formData.latitude} onChange={handleChange} />
              </label>

              <label className="form-group">
                <span>Longitude</span>
                <input type="number" name="longitude" step="any" placeholder="76.2421" value={formData.longitude} onChange={handleChange} />
              </label>
            </div>

            <label className="form-group full-width-group">
              <span>Amenities (comma separated)</span>
              <input type="text" name="amenities" placeholder="Wi-Fi, Breakfast, AC" value={formData.amenities} onChange={handleChange} />
            </label>

            <label className="form-group full-width-group">
              <span>Description</span>
              <textarea name="description" rows="3" placeholder="Hotel description..." value={formData.description} onChange={handleChange} />
            </label>

            <div className="image-upload-row">
              <label className="form-group">
                <span>Image Upload (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                  <span>Preview</span>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn big-btn">{editingId ? "Update Hotel" : "Add Hotel"}</button>
              {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="hotels-list-section">
          <div className="section-header-row">
            <div>
              <h2>All Hotels ({filteredHotels.length})</h2>
              <p className="subtitle">List of all hotels currently saved.</p>
            </div>
            <div className="search-filter-box">
              <input type="text" placeholder="Search hotels..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <p className="loading-state">Loading hotels...</p>
          ) : filteredHotels.length === 0 ? (
            <div className="empty-state"><p>No hotels found.</p></div>
          ) : (
            <div className="hotels-table-container">
              <table className="manage-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Rooms</th>
                    <th>Rating</th>
                    <th>Coordinates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHotels.map((h) => (
                    <tr key={h.id} className={editingId === h.id ? "row-editing" : ""}>
                      <td>#{h.id}</td>
                      <td><img src={h.image || hotelExteriorImage} alt={h.name} className="table-thumb" /></td>
                      <td>{h.name}</td>
                      <td>{h.city}, {h.state || "Kerala"}</td>
                      <td>₹{h.price}</td>
                      <td>{h.rooms}</td>
                      <td>★ {h.rating}</td>
                      <td>
                        {h.latitude && h.longitude ? (
                          <span className="coord-chip">{Number(h.latitude).toFixed(4)}°, {Number(h.longitude).toFixed(4)}°</span>
                        ) : (
                          <span className="muted-text">None</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          <button className="small-btn info-btn" onClick={() => navigate(`/hotels/${h.id}`)}>Details</button>
                          <button className="small-btn" onClick={() => startEdit(h)}>Edit</button>
                          <button className="small-btn danger" onClick={() => handleDelete(h)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ManageHotels;
