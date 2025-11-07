// src/pages/OrdersPage.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import "./OrdersPage.css";

export default function OrdersPage() {
  const location = useLocation();
  const newOrder = location.state?.newOrder; 

  const [orders, setOrders] = useState([
    {
      id: 1,
      restaurant: "Sushi Heaven",
      items: ["Salmon Roll", "Miso Soup"],
      total: 25.5,
      status: "Pending",
      date: "Nov 6, 2025",
    },
    {
      id: 2,
      restaurant: "Pizza Planet",
      items: ["Pepperoni Pizza", "Garlic Knots"],
      total: 22.0,
      status: "In Delivery",
      date: "Nov 6, 2025",
    },
    {
      id: 3,
      restaurant: "BBQ King",
      items: ["Ribs", "Coleslaw"],
      total: 30.0,
      status: "Completed",
      date: "Nov 3, 2025",
    },
    {
      id: 4,
      restaurant: "Noodle House",
      items: ["Beef Noodles", "Spring Rolls"],
      total: 18.5,
      status: "Cancelled",
      date: "Nov 2, 2025",
    },
  ]);

  const [filter, setFilter] = useState("All");

  
  useEffect(() => {
    if (newOrder) {
      setOrders((prev) => [newOrder, ...prev]); 
    }
  }, [newOrder]);

  
  const handleCancel = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "Cancelled" } : order
      )
    );
  };

 
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">Your Orders</h1>
        <p className="orders-subtitle">View and manage all your recent orders</p>

       
        <div className="filter-tabs">
          {["All", "Pending", "In Delivery", "Completed", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? "active" : ""}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            )
          )}
        </div>

       
        <div className="orders-grid">
          {filteredOrders.length === 0 ? (
            <p className="no-orders">No orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3 className="restaurant-name">{order.restaurant}</h3>
                    <p className="order-date">{order.date}</p>
                  </div>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <ul className="order-items">
                  {order.items.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>

                <div className="order-footer">
                  <p className="order-total">Total: ${order.total.toFixed(2)}</p>

                  {order.status === "Pending" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
