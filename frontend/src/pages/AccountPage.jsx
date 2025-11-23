import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountPage.css";
import usePageTitle from "../hooks/usePageTitle";

export default function AccountPage() {
  usePageTitle("SnapEats - My Account");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
        navigate("/"); 
        return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    // localStorage.removeItem("snapEats_cart"); 
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="account-container">
        <h1>My Account</h1>
        
        <div className="profile-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Avatar"
            className="avatar"
          />
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.email}</p>

          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate("/payment")}>💳 Payment</button>
            <button className="action-btn" onClick={() => navigate("/address-book")}>📍 Address Book</button>
            <button className="action-btn" onClick={() => navigate("/profile-edit")}>✏️ Edit Profile</button>
          </div>

          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
