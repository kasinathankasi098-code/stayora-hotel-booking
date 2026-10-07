import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { translations } from "../languages/translations";
import goaImage from "../assets/images/goa-beach.jpg";
import { getDestinations } from "../services/api";

const defaultDestinations = [
  "Kerala",
  "Tamil Nadu",
  "Goa",
  "Karnataka"
];

function Home() {
  const navigate = useNavigate();
  const language = localStorage.getItem("language") || "English";
  const text = translations[language] || translations.English;
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState(defaultDestinations);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const res = await getDestinations();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDestinations(res.data);
        }
      } catch (err) {
        console.warn("Could not load destinations:", err.message);
      }
    }
    loadDestinations();
  }, []);

  function handleDestinationChange(event) {
    setDestination(event.target.value);
  }

  function handleSearch(event) {
    event.preventDefault();
    navigate("/hotels", { state: { destination } });
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="destination-home">
        <img className="home-video-fallback" src={goaImage} alt="" />
        <video className="home-video" autoPlay muted loop playsInline poster={goaImage}>
          <source
            src="https://cdn.pixabay.com/video/2016/11/15/6399-191636228_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="home-video-overlay"></div>

        <section className="home-message">
          <p className="home-brand">{text.appName}</p>
          <h1>{text.simpleHomeTitle.toUpperCase()}</h1>
          <p className="home-description">{text.simpleHomeDescription}</p>

          <form className="destination-search" onSubmit={handleSearch}>
            <label htmlFor="destination-choice">{text.chooseDestination}</label>
            <div className="destination-search-row">
              <select
                id="destination-choice"
                required
                value={destination}
                onChange={handleDestinationChange}
              >
                <option value="">{text.selectDestination}</option>
                {destinations.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
              <button className="primary-btn" type="submit">
                {text.searchHotels}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Home;
