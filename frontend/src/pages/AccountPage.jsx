import { useNavigate } from "react-router-dom";
import "./AccountPage.css";

export default function AccountPage() {
  const navigate = useNavigate();

  const user = {
    name: "Xinhang Yang",
    email: "xinhang.yang@example.com",
    joined: "March 2024",
    totalOrders: 24,
    totalSpent: 521.75,
    activeOrders: 2,
  };

 
  const handleSignOut = () => {
    localStorage.removeItem("currentUser"); /
    alert("👋 You have signed out successfully!");
    navigate("/"); 
  };

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
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p className="joined">Joined {user.joined}</p>

          <div className="button-row">
            <button className="edit-btn">Edit Profile</button>
            <button className="signout-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>

        
        <div className="account-stats">
          <div className="stat-box">
            <h3>${user.totalSpent.toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
          <div className="stat-box">
            <h3>{user.totalOrders}</h3>
            <p>Orders Placed</p>
          </div>
          <div className="stat-box">
            <h3>{user.activeOrders}</h3>
            <p>Active Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
