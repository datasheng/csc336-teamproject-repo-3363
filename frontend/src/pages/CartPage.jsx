import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([
    { id: 1, name: "Salmon Roll", price: 12.5, quantity: 2 },
    { id: 2, name: "Miso Soup", price: 4.5, quantity: 1 },
    { id: 3, name: "Spicy Tuna", price: 14.0, quantity: 1 },
  ]);

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <p className="empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>
                      ＋
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p className="total">Total: ${total.toFixed(2)}</p>

              
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout", { state: { cart } })}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
