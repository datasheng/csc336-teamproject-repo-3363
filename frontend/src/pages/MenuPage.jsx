import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./MenuPage.css";
import orderBg from "../assets/orderpage.png";
import { fetchJSON } from "../api";
import usePageTitle from "../hooks/usePageTitle";

function MenuItemCard({ item, restID, restName }) {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    const currentCart = JSON.parse(localStorage.getItem("snapEats_cart") || "[]");
    const existingIndex = currentCart.findIndex((i) => i.id === item.id);
    
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += qty;
    } else {
      currentCart.push({ ...item, quantity: qty, restID, restName });
    }
    
    localStorage.setItem("snapEats_cart", JSON.stringify(currentCart));
    alert(`Added ${qty} x ${item.name} to cart`);
    setQty(1); // reset
  };

  return (
    <div className="menu-card">
      <div className="img-container">
        <img src={item.img} alt={item.name} />
      </div>
      <div className="menu-info">
        <div className="menu-header">
          <h3>{item.name}</h3>
          <span className="price">${Number(item.price).toFixed(2)}</span>
        </div>
        <p className="item-desc">{item.description}</p>
        
        <div className="actions-row">
            <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="add-btn" onClick={handleAdd}>🛒 Add</button>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);

  usePageTitle(restaurant ? `SnapEats - ${restaurant.name}` : "SnapEats - Menu");

  useEffect(() => {
    const itemToImg = (name) => {
      const map = {
        "Salmon Nigiri": new URL("../assets/test2.png", import.meta.url).href,
        "Tuna Roll": new URL("../assets/tunaroll.webp", import.meta.url).href,
        "Dragon Roll": new URL("../assets/dragonRoll.jpg", import.meta.url).href,
        "Miso Soup": new URL("../assets/misoSoup.webp", import.meta.url).href,
        "Carbonara": new URL("../assets/carbonara.jpg", import.meta.url).href,
        "Alfredo": new URL("../assets/alfredo.webp", import.meta.url).href,
        "Lasagna": new URL("../assets/lasagna.jpg", import.meta.url).href,
        "Garlic Bread": new URL("../assets/garlicBread.jpeg", import.meta.url).href,
        "Cheeseburger": new URL("../assets/chesseBurger.webp", import.meta.url).href,
        "Bacon Burger": new URL("../assets/baconBurger.jpg", import.meta.url).href,
        "Veggie Burger": new URL("../assets/veggieBurger.jpeg", import.meta.url).href,
        "French Fries": new URL("../assets/frenchFries.webp", import.meta.url).href,
        "Kung Pao Chicken": new URL("../assets/KungPao.webp", import.meta.url).href,
        "Mapo Tofu": new URL("../assets/MapoTofu.jpeg", import.meta.url).href,
        "Hotpot": new URL("../assets/hotPot.jpg", import.meta.url).href,
        "Spring Rolls": new URL("../assets/springRolls.avif", import.meta.url).href,
        "Avocado Salad": new URL("../assets/avocadosalad.jpg", import.meta.url).href,
        "Vegan Burger": new URL("../assets/veggieBurger.jpeg", import.meta.url).href,
        "Tofu Bowl": new URL("../assets/tofubowl.jpg", import.meta.url).href,
        "Coconut Smoothie": new URL("../assets/coconutsmoothie.jpg", import.meta.url).href,
        "Grilled Salmon": new URL("../assets/salmon.webp", import.meta.url).href,
        "Shrimp Pasta": new URL("../assets/shrimppasta.jpg", import.meta.url).href,
        "Lobster Tail": new URL("../assets/lobstertail.jpg", import.meta.url).href,
        "Seafood Chowder": new URL("../assets/seafoodchowder.jpg", import.meta.url).href,
      };
      return map[name] || new URL("../assets/test2.png", import.meta.url).href;
    };

    (async () => {
      try {
        const [rest, menuItems, reviewList] = await Promise.all([
          fetchJSON(`/restaurants/${id}`),
          fetchJSON(`/restaurants/${id}/menu`),
          fetchJSON(`/restaurants/${id}/reviews`),
        ]);
        setRestaurant(rest);
        setItems(
          menuItems.map((it) => ({
            ...it,
            img: itemToImg(it.name),
          }))
        );
        setReviews(reviewList);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  if (!restaurant) {
    return (
      <div className="menu-page">
        <h2>Restaurant not found</h2>
        <button onClick={() => navigate("/home")}>⬅ Back</button>
      </div>
    );
  }

  return (
    <div className="menu-page" style={{ backgroundImage: `url(${orderBg})` }}>
      <Sidebar />

      <div className="menu-container">
        <div className="restaurant-header">
            <h1 className="menu-title">{restaurant.name}</h1>
            <div className="restaurant-details" style={{ fontSize: '1.2em', color: '#555', marginBottom: '20px' }}>
                <p>
                  {restaurant.rating != null
                    ? `⭐ ${restaurant.rating.toFixed(1)} (${restaurant.reviewCount} review${restaurant.reviewCount === 1 ? '' : 's'})`
                    : '⭐ No reviews yet'}
                </p>
                <p>📍 {restaurant.loc} &emsp; &emsp; 📞 {restaurant.tel}</p>
            </div>
        </div>

        <div className="menu-grid">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} restID={restaurant.id} restName={restaurant.name} />
          ))}
        </div>

        <div className="reviews-section" style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.92)', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '15px' }}>Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p style={{ color: '#666' }}>No reviews yet. Be the first to leave one after your order!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {reviews.map((rv) => (
                <li key={rv.reviewID} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{rv.customerName}</strong>
                    <span>{'⭐'.repeat(rv.rating)}</span>
                  </div>
                  {rv.reviewText && <p style={{ margin: '6px 0 0', color: '#444' }}>{rv.reviewText}</p>}
                  <small style={{ color: '#888' }}>
                    {new Date(rv.reviewTime).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="back-btn" onClick={() => navigate("/home")}>
          ⬅ Back to Restaurants
        </button>
      </div>
    </div>
  );
}
