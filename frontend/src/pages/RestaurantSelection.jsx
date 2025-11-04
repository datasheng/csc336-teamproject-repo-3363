// src/pages/RestaurantSelection.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import orderBg from "../assets/orderpage.png";
import "./RestaurantSelection.css";

export default function RestaurantSelection() {
  const [searchText, setSearchText] = useState("");
  const [address, setAddress] = useState("Getting your location...");
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

 
  const restaurants = [
    { id: 1, name: "Sushi Zen", img: "/src/assets/test.png", rating: 4.8 },
    { id: 2, name: "Pasta House", img: "/src/assets/restaurant2.jpg", rating: 4.6 },
    { id: 3, name: "Burger Hub", img: "/src/assets/restaurant3.jpg", rating: 4.5 },
    { id: 4, name: "Spicy Garden", img: "/src/assets/restaurant4.jpg", rating: 4.9 },
    { id: 5, name: "Vegan Paradise", img: "/src/assets/restaurant5.jpg", rating: 4.4 },
    { id: 6, name: "Seafood Bay", img: "/src/assets/restaurant6.jpg", rating: 4.7 },
  ];

  return (
    <div className="orders-page" style={{ backgroundImage: `url(${orderBg})` }}>
      <Sidebar />

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
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="restaurant-card"
              onClick={() => navigate(`/menu/${r.id}`)}
            >
              
              <img src={r.img} alt={r.name} />

              
              <div className="restaurant-text">
                <h3>{r.name}</h3>
                <p className="rating">⭐ {r.rating} Google rating</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
