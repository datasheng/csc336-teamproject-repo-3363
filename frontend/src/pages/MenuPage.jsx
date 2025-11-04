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
        { name: "Tuna Roll", price: "$10", img: new URL("../assets/sushi2.jpg", import.meta.url).href },
        { name: "Dragon Roll", price: "$15", img: new URL("../assets/sushi3.jpg", import.meta.url).href },
        { name: "Miso Soup", price: "$5", img: new URL("../assets/soup.jpg", import.meta.url).href },
      ],
    },
    2: {
      name: "Pasta House 🍝",
      items: [
        { name: "Carbonara", price: "$14", img: new URL("../assets/pasta1.jpg", import.meta.url).href },
        { name: "Alfredo", price: "$13", img: new URL("../assets/pasta2.jpg", import.meta.url).href },
        { name: "Lasagna", price: "$16", img: new URL("../assets/pasta3.jpg", import.meta.url).href },
        { name: "Garlic Bread", price: "$5", img: new URL("../assets/bread.jpg", import.meta.url).href },
      ],
    },
    3: {
      name: "Burger Hub 🍔",
      items: [
        { name: "Cheeseburger", price: "$11", img: new URL("../assets/burger1.jpg", import.meta.url).href },
        { name: "Bacon Burger", price: "$13", img: new URL("../assets/burger2.jpg", import.meta.url).href },
        { name: "Veggie Burger", price: "$10", img: new URL("../assets/burger3.jpg", import.meta.url).href },
        { name: "French Fries", price: "$4", img: new URL("../assets/fries.jpg", import.meta.url).href },
      ],
    },
    4: {
      name: "Spicy Garden 🌶️",
      items: [
        { name: "Kung Pao Chicken", price: "$12", img: new URL("../assets/spicy1.jpg", import.meta.url).href },
        { name: "Mapo Tofu", price: "$11", img: new URL("../assets/spicy2.jpg", import.meta.url).href },
        { name: "Hotpot", price: "$20", img: new URL("../assets/hotpot.jpg", import.meta.url).href },
        { name: "Spring Rolls", price: "$6", img: new URL("../assets/rolls.jpg", import.meta.url).href },
      ],
    },
    5: {
      name: "Vegan Paradise 🥗",
      items: [
        { name: "Avocado Salad", price: "$10", img: new URL("../assets/salad1.jpg", import.meta.url).href },
        { name: "Vegan Burger", price: "$12", img: new URL("../assets/vegan1.jpg", import.meta.url).href },
        { name: "Tofu Bowl", price: "$11", img: new URL("../assets/tofu.jpg", import.meta.url).href },
        { name: "Coconut Smoothie", price: "$6", img: new URL("../assets/drink1.jpg", import.meta.url).href },
      ],
    },
    6: {
      name: "Seafood Bay 🦞",
      items: [
        { name: "Grilled Salmon", price: "$18", img: new URL("../assets/fish1.jpg", import.meta.url).href },
        { name: "Shrimp Pasta", price: "$16", img: new URL("../assets/fish2.jpg", import.meta.url).href },
        { name: "Lobster Tail", price: "$25", img: new URL("../assets/fish3.jpg", import.meta.url).href },
        { name: "Seafood Chowder", price: "$9", img: new URL("../assets/soup2.jpg", import.meta.url).href },
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
