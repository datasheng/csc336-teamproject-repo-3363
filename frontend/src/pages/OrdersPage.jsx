import { useState, useEffect } from "react";
import "./OrdersPage.css";
import { fetchJSON } from "../api";
import usePageTitle from "../hooks/usePageTitle";

export default function OrdersPage() {
  usePageTitle("SnapEats - Orders");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
            deliveryAddress: o.deliveryAddress,
            hasReview: o.hasReview,
            reviewRating: o.reviewRating,
        }));
        setOrders(mapped);
    } catch (e) {
        console.error(e);
    }
  };

  const openReviewModal = (order) => {
    setReviewModal(order);
    setReviewRating(5);
    setReviewText("");
  };

  const submitReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      await fetchJSON(`/orders/${reviewModal.id}/review`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, reviewText }),
      });
      setReviewModal(null);
      loadOrders();
    } catch (e) {
      alert("Failed to submit review: " + e.message);
    } finally {
      setSubmitting(false);
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

                  {order.status.toLowerCase() === "completed" && !order.hasReview && (
                    <button
                      className="cancel-btn"
                      style={{ background: '#f5a623' }}
                      onClick={() => openReviewModal(order)}
                    >
                      Leave a Review
                    </button>
                  )}

                  {order.status.toLowerCase() === "completed" && order.hasReview && (
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      Your rating: {'⭐'.repeat(order.reviewRating || 0)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {reviewModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => !submitting && setReviewModal(null)}
        >
          <div
            style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Review {reviewModal.restaurant}</h2>
            <div style={{ fontSize: '2rem', textAlign: 'center', margin: '16px 0', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setReviewRating(n)}
                  style={{ opacity: n <= reviewRating ? 1 : 0.3 }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your experience (optional)"
              rows={4}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px', fontSize: '0.95rem' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => setReviewModal(null)} disabled={submitting}>Cancel</button>
              <button
                onClick={submitReview}
                disabled={submitting}
                style={{ background: '#f5a623', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
