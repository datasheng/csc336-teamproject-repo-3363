// src/components/Layout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  
  const isActive = (to) => {
    if (to === "/orders") return pathname === "/orders" || pathname.startsWith("/menu/");
    if (to === "/cart") return pathname === "/cart";
    if (to === "/account") return pathname === "/account";
    return false;
  };

  const cls = (to) => "menu-item" + (isActive(to) ? " active" : "");

  return (
    <div className="layout-container">
     
      <div className="mini-sidebar">
        <div className={cls("/orders")} onClick={() => navigate("/orders")}>
          🏠 Home
        </div>

        <div className={cls("/orders")} onClick={() => navigate("/orders")}>
          🧾 Orders
        </div>

        <div className={cls("/cart")} onClick={() => navigate("/cart")}>
          🛒 Cart
        </div>

        <div className={cls("/account")} onClick={() => navigate("/account")}>
          👤 Account
        </div>
      </div>

      
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}
