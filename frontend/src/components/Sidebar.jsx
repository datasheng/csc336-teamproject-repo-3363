import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();


  if (pathname === "/" || pathname === "/signup") return null;

  
  const isActive = (to) => {
    if (to === "/home") return pathname === "/home";
    if (to === "/menu") return pathname.startsWith("/menu/");
    return pathname === to;
  };

  const cls = (to) => "menu-item" + (isActive(to) ? " active" : "");

  return (
    <div className="mini-sidebar">
      
      <div
        className={cls("/home")}
        onClick={() => {
          if (pathname !== "/home") navigate("/home");
        }}
      >
        🏠 Home
      </div>

      <div
        className={cls("/orders")}
        onClick={() => {
          if (pathname !== "/orders") navigate("/orders");
        }}
      >
        🧾 Orders
      </div>

      <div
        className={cls("/cart")}
        onClick={() => {
          if (pathname !== "/cart") navigate("/cart");
        }}
      >
        🛒 Cart
      </div>

      <div
        className={cls("/account")}
        onClick={() => {
          if (pathname !== "/account") navigate("/account");
        }}
      >
        👤 Account
      </div>
    </div>
  );
}
