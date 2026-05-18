// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orderBg from "../assets/orderpage.png";
import "./HomePage.css";
import { fetchJSON } from "../api";
import usePageTitle from "../hooks/usePageTitle";

export default function HomePage() {
  usePageTitle("SnapEats - Home");
  const [searchText, setSearchText] = useState("");
  const [address, setAddress] = useState("Getting your location...");
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setAddress(data.display_name || "Location found");
          } catch {
            setAddress("Unable to fetch address");
          }
        },
        () => setAddress("Permission denied")
      );
    } else {
      setAddress("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    const nameToImg = (name) => {
      const map = {
        "Sushi Zen": new URL("../assets/test.png", import.meta.url).href,
        "Pasta House": new URL("../assets/pastaHouse.jpg", import.meta.url).href,
        "Burger Hub": new URL("../assets/burger.jpg", import.meta.url).href,
        "Spicy Garden": new URL("../assets/spicyGarden.jpeg", import.meta.url).href,
        "Vegan Paradise": new URL("../assets/VeganParadise.jpg", import.meta.url).href,
        "Seafood Bay": new URL("../assets/Seafood.jpg", import.meta.url).href,
      };
      return map[name] || new URL("../assets/test.png", import.meta.url).href;
    };
    (async () => {
      try {
        const data = await fetchJSON("/restaurants");
        setRestaurants(
          data.map((r) => ({
            ...r,
            img: nameToImg(r.name),
          }))
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="orders-page" style={{ backgroundImage: `url(${orderBg})` }}>
     

      <div className="main-content">
        <div className="top-bar">
          <div className="search-box">
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="Search for restaurants..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="location-box">
            <span className="icon">📍</span>
            <input type="text" value={address} readOnly />
          </div>
        </div>

        <div className="restaurant-grid">
          {restaurants
            .filter((r) =>
              r.name.toLowerCase().includes(searchText.trim().toLowerCase())
            )
            .map((r) => (
            <div
              key={r.id}
              className="restaurant-card"
              onClick={() => navigate(`/menu/${r.id}`)}
            >
              <img src={r.img} alt={r.name} />
              <div className="restaurant-text">
                <h3>{r.name}</h3>
                <p className="rating">
                  {r.rating != null
                    ? `⭐ ${r.rating.toFixed(1)} (${r.reviewCount})`
                    : "⭐ No reviews yet"}
                </p>
                <p className="rating">📍 {r.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
