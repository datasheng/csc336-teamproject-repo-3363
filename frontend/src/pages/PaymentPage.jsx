import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";
import "./AccountPage.css";
import usePageTitle from "../hooks/usePageTitle";

export default function PaymentPage() {
  usePageTitle("SnapEats - Payment");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newCard, setNewCard] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return navigate("/");
    const u = JSON.parse(stored);
    setUser(u);
    loadPayments(u.usrID);
  }, [navigate]);

  const loadPayments = async (uid) => {
    try {
        const data = await fetchJSON(`/users/${uid}/payments`);
        setPayments(data);
    } catch (e) {
        console.error(e);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCard) return;
    try {
        await fetchJSON(`/users/${user.usrID}/payments`, {
            method: "POST",
            body: JSON.stringify({ cardNum: newCard })
        });
        setNewCard("");
        loadPayments(user.usrID);
        setMsg("✅ Card added");
    } catch (err) {
        setMsg("❌ " + err.message);
    }
  };

  const handleDelete = async (pid) => {
    if (!window.confirm("Remove this card?")) return;
    try {
        await fetchJSON(`/payments/${pid}`, { method: "DELETE" });
        loadPayments(user.usrID);
    } catch (err) {
        alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="account-container">
        <h1>Payment Methods</h1>
        
        <div className="list-container">
            {payments.length === 0 ? <p>No cards saved.</p> : (
                <ul className="data-list">
                    {payments.map(p => (
                        <li key={p.paymentID} className="data-item">
                            <span>💳 {p.masked}</span>
                            <button className="delete-icon-btn" onClick={() => handleDelete(p.paymentID)}>🗑️</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <form className="add-form" onSubmit={handleAdd}>
            <h3>Add New Card</h3>
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Card Number" 
                    value={newCard} 
                    onChange={e => setNewCard(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="add-btn-small">Add Card</button>
        </form>
        {msg && <p className="msg-text">{msg}</p>}

        <button className="back-btn-small" onClick={() => navigate("/account")}>⬅ Back to Account</button>
      </div>
    </div>
  );
}

