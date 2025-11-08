import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./MenuPage.css";
import orderBg from "../assets/orderpage.png";

export default function MenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const menus = {
    1: {
      name: "Sushi Zen 🍣",
      items: [
        { name: "Salmon Nigiri", price: "$12", img: new URL("../assets/test2.png", import.meta.url).href },
        { name: "Tuna Roll", price: "$10", img: new URL("../assets/tunaroll.webp", import.meta.url).href },
        { name: "Dragon Roll", price: "$15", img: new URL("../assets/dragonRoll.jpg", import.meta.url).href },
        { name: "Miso Soup", price: "$5", img: new URL("../assets/misoSoup.webp", import.meta.url).href },
      ],
    },
    2: {
      name: "Pasta House 🍝",
      items: [
        { name: "Carbonara", price: "$14", img: new URL("../assets/carbonara.jpg", import.meta.url).href },
        { name: "Alfredo", price: "$13", img: new URL("../assets/alfredo.webp", import.meta.url).href },
        { name: "Lasagna", price: "$16", img: new URL("../assets/lasagna.jpg", import.meta.url).href },
        { name: "Garlic Bread", price: "$5", img: new URL("../assets/garlicBread.jpeg", import.meta.url).href },
      ],
    },
    3: {
      name: "Burger Hub 🍔",
      items: [
        { name: "Cheeseburger", price: "$11", img: new URL("../assets/chesseBurger.webp", import.meta.url).href },
        { name: "Bacon Burger", price: "$13", img: new URL("../assets/baconBurger.jpg", import.meta.url).href },
        { name: "Veggie Burger", price: "$10", img: new URL("../assets/veggieBurger.jpeg", import.meta.url).href },
        { name: "French Fries", price: "$4", img: new URL("../assets/frenchFries.webp", import.meta.url).href },
      ],
    },
    4: {
      name: "Spicy Garden 🌶️",
      items: [
        { name: "Kung Pao Chicken", price: "$12", img: new URL("../assets/KungPao.webp", import.meta.url).href },
        { name: "Mapo Tofu", price: "$11", img: new URL("../assets/MapoTofu.jpeg", import.meta.url).href },
        { name: "Hotpot", price: "$20", img: new URL("../assets/hotPot.jpg", import.meta.url).href },
        { name: "Spring Rolls", price: "$6", img: new URL("../assets/springrolls.avif", import.meta.url).href },
      ],
    },
    5: {
      name: "Vegan Paradise 🥗",
      items: [
        { name: "Avocado Salad", price: "$10", img: new URL("../assets/avocadosalad.jpg", import.meta.url).href },
        { name: "Vegan Burger", price: "$12", img: new URL("../assets/veggieBurger.jpeg", import.meta.url).href },
        { name: "Tofu Bowl", price: "$11", img: new URL("../assets/tofubowl.jpg", import.meta.url).href },
        { name: "Coconut Smoothie", price: "$6", img: new URL("../assets/coconutsmoothie.jpg", import.meta.url).href },
      ],
    },
    6: {
      name: "Seafood Bay 🦞",
      items: [
        { name: "Grilled Salmon", price: "$18", img: new URL("../assets/salmon.webp", import.meta.url).href },
        { name: "Shrimp Pasta", price: "$16", img: new URL("../assets/shrimppasta.jpg", import.meta.url).href },
        { name: "Lobster Tail", price: "$25", img: new URL("../assets/lobstertail.jpg", import.meta.url).href },
        { name: "Seafood Chowder", price: "$9", img: new URL("../assets/seafoodchowder.jpg", import.meta.url).href },
      ],
    },
  };

  const restaurant = menus[id];

  if (!restaurant) {
    return (
      <div className="menu-page">
        <h2>Restaurant not found</h2>
        <button onClick={() => navigate("/orders")}>⬅ Back</button>
      </div>
    );
  }

  return (
    <div className="menu-page" style={{ backgroundImage: `url(${orderBg})` }}>
      <Sidebar />

      <div className="menu-container">
        <h1 className="menu-title">{restaurant.name}</h1>

        <div className="menu-grid">
          {restaurant.items.map((item, index) => (
            <div className="menu-card" key={index}>
              <img src={item.img} alt={item.name} />
              <div className="menu-info">
                <div className="menu-header">
                  <h3>{item.name}</h3>
                  <span className="price">{item.price}</span>
                </div>
                <button className="add-btn">🛒 Add to Order</button>
              </div>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate("/orders")}>
          ⬅ Back to Restaurants
        </button>
      </div>
    </div>
  );
}
