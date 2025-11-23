import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";
import { fetchJSON } from "../api";
import usePageTitle from "../hooks/usePageTitle";

export default function CheckoutPage() {
  usePageTitle("SnapEats - Checkout");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get items passed from CartPage
  const cartItems = location.state?.items || [];

  const [currentUser, setCurrentUser] = useState(null);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [showAddrModal, setShowAddrModal] = useState(false);

  const [payments, setPayments] = useState([]);
  const [selectedPayId, setSelectedPayId] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      alert("Please login to checkout");
      navigate("/");
      return;
    }
    const u = JSON.parse(userStr);
    setCurrentUser(u);

    // Parallel fetch
    Promise.all([
        fetchJSON(`/users/${u.usrID}/addresses`).catch(() => []),
        fetchJSON(`/users/${u.usrID}/payments`).catch(() => [])
    ]).then(([addrData, payData]) => {
        setAddresses(addrData);
        if (addrData.length > 0) setSelectedAddrId(addrData[0].addID);

        setPayments(payData);
        if (payData.length > 0) setSelectedPayId(payData[0].paymentID);
        
        setLoading(false);
    });
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleConfirm = async () => {
    if (cartItems.length === 0) return;
    if (!selectedAddrId || !selectedPayId) return alert("Please select address and payment method.");

    // Although we restricted to single restaurant in Cart, let's be safe and pick the first one's restID
    const restID = cartItems[0].restID;
    
    try {
        await fetchJSON("/orders", {
            method: "POST",
            body: JSON.stringify({
                usrID: currentUser.usrID,
                restID: restID,
                items: cartItems.map(i => ({ itemID: i.id, quantity: i.quantity })),
                custAddrID: selectedAddrId
            })
        });
        
        // Remove checked out items from global cart
        const globalCart = JSON.parse(localStorage.getItem("snapEats_cart") || "[]");
        const checkedOutIds = new Set(cartItems.map(i => i.id));
        const remaining = globalCart.filter(i => !checkedOutIds.has(i.id));
        localStorage.setItem("snapEats_cart", JSON.stringify(remaining));

        alert("Order placed successfully!");
        navigate("/orders");

    } catch (err) {
        console.error(err);
        alert("Failed to place order: " + err.message);
    }
  };

  if (loading) return <div className="checkout-page"><p>Loading...</p></div>;

  const selectedAddr = addresses.find(a => a.addID === selectedAddrId);
  const selectedPay = payments.find(p => p.paymentID === selectedPayId);
  const canCheckout = cartItems.length > 0 && selectedAddr && selectedPay;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
       
        {/* Shipping Section */}
        <div className="section">
          <h2>Shipping Information</h2>
          <div className="info">
            <p><strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
            {selectedAddr ? (
                <>
                    <p><strong>Address:</strong> {selectedAddr.address}</p>
                    <p><strong>Phone:</strong> {selectedAddr.contactNum || "N/A"}</p>
                </>
            ) : (
                <p style={{color:'red'}}>Address book is empty. Please add an address.</p>
            )}
            <div className="btn-row-small">
                <button className="edit-btn" onClick={() => setShowAddrModal(true)}>Change Address</button>
                {!selectedAddr && <button className="edit-btn" onClick={() => navigate("/address-book")}>Add New</button>}
            </div>
          </div>
        </div>
       
        {/* Order Summary */}
        <div className="section">
          <h2>Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>No items selected.</p>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="summary-item">
                <p>{item.name} × {item.quantity}</p>
                <p>${(Number(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
          <hr />
          <p className="total">Total: ${total.toFixed(2)}</p>
        </div>
       
        {/* Payment Section */}
        <div className="section">
          <h2>Payment Method</h2>
          <div className="info">
            <p><strong>Method:</strong> Credit Card</p>
            {selectedPay ? (
                <p><strong>Card:</strong> {selectedPay.masked}</p>
            ) : (
                 <p style={{color:'red'}}>No payment method found. Please add a card.</p>
            )}
            <div className="btn-row-small">
                <button className="edit-btn" onClick={() => setShowPayModal(true)}>Change Card</button>
                 {!selectedPay && <button className="edit-btn" onClick={() => navigate("/payment")}>Add New</button>}
            </div>
          </div>
        </div>
        
        <button 
            className={`confirm-btn ${!canCheckout ? "disabled" : ""}`} 
            onClick={handleConfirm} 
            disabled={!canCheckout}
        >
          {canCheckout ? "Confirm Order" : "Missing Address/Payment"}
        </button>
      </div>

      {/* Address Modal */}
      {showAddrModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Select Address</h3>
                {addresses.length === 0 && <p>No addresses found.</p>}
                <ul className="select-list">
                    {addresses.map(a => (
                        <li key={a.addID} onClick={() => { setSelectedAddrId(a.addID); setShowAddrModal(false); }} className={selectedAddrId === a.addID ? "selected" : ""}>
                            {a.address}
                        </li>
                    ))}
                </ul>
                <div className="modal-actions">
                    <button onClick={() => navigate("/address-book")}>Manage Addresses</button>
                    <button onClick={() => setShowAddrModal(false)}>Close</button>
                </div>
            </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Select Card</h3>
                {payments.length === 0 && <p>No cards found.</p>}
                <ul className="select-list">
                    {payments.map(p => (
                        <li key={p.paymentID} onClick={() => { setSelectedPayId(p.paymentID); setShowPayModal(false); }} className={selectedPayId === p.paymentID ? "selected" : ""}>
                            {p.masked}
                        </li>
                    ))}
                </ul>
                <div className="modal-actions">
                    <button onClick={() => navigate("/payment")}>Manage Payments</button>
                    <button onClick={() => setShowPayModal(false)}>Close</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
