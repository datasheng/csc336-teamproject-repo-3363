import { useState, useEffect } from "react";
import "./OrdersPage.css";
import { fetchJSON } from "../api";
import usePageTitle from "../hooks/usePageTitle";

export default function OrdersPage() {
  usePageTitle("SnapEats - Orders");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    try {
        const data = await fetchJSON(`/orders?usrID=${user.usrID}`);
        const mapped = data.map(o => ({
            id: o.id,
            restaurant: o.restaurant,
            items: o.items.map(i => `${i.name} x${i.quantity}`),
            total: o.total,
            status: o.orderStatus || "Pending",
            date: new Date(o.orderTime).toLocaleDateString(),
            deliveryAddress: o.deliveryAddress // Backend now returns this
        }));
        setOrders(mapped);
    } catch (e) {
        console.error(e);
    }
  };
  
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
        await fetchJSON(`/orders/${id}/cancel`, { method: "POST" });
        alert("Order canceled successfully");
        loadOrders(); // Reload list
    } catch (e) {
        alert("Failed to cancel: " + e.message);
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">Your Orders</h1>
        <p className="orders-subtitle">View and manage all your recent orders</p>
       
        <div className="filter-tabs">
          {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map(
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
                
                {order.deliveryAddress && (
                    <div style={{ textAlign: 'left', fontSize: '0.9rem', color: '#555', margin: '5px 0' }}>
                        📍 {order.deliveryAddress}
                    </div>
                )}

                <ul className="order-items">
                  {order.items.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>

                <div className="order-footer">
                  <p className="order-total">Total: ${order.total.toFixed(2)}</p>

                  {(order.status.toLowerCase() === "pending") && (
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
