import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const cart = location.state?.cart || [];

  const [userInfo, setUserInfo] = useState({
    name: "Xinhang Yang",
    address: "123 Main Street, New York, NY",
    phone: "+1 555-123-4567",
  });

  const [payment, setPayment] = useState("Credit Card");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = () => {
    const newOrder = {
      id: Date.now(),
      restaurant: "Your Selected Restaurant",
      items: cart.map((c) => c.name),
      total: total,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    
    navigate("/orders", { state: { newOrder } });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

       
        <div className="section">
          <h2>Shipping Information</h2>
          <div className="info">
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Address:</strong> {userInfo.address}</p>
            <p><strong>Phone:</strong> {userInfo.phone}</p>
            <button className="edit-btn">Edit</button>
          </div>
        </div>

       
        <div className="section">
          <h2>Order Summary</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="summary-item">
                <p>{item.name} × {item.quantity}</p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
          <hr />
          <p className="total">Total: ${total.toFixed(2)}</p>
        </div>

       
        <div className="section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            {["Credit Card", "PayPal", "Cash on Delivery"].map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                />
                {method}
              </label>
            ))}
          </div>
        </div>

        
        <button className="confirm-btn" onClick={handleConfirm}>
          Confirm Order
        </button>
      </div>
    </div>
  );
}
