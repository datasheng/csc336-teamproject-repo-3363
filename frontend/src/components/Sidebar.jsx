import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ✅ 登录页或注册页隐藏 Sidebar
  if (pathname === "/" || pathname === "/signup") return null;

  // ✅ 判断当前路径是否高亮
  const isActive = (to) => {
    if (to === "/restaurants") return pathname === "/restaurants";
    if (to === "/menu") return pathname.startsWith("/menu/");
    return pathname === to;
  };

  const cls = (to) => "menu-item" + (isActive(to) ? " active" : "");

  return (
    <div className="mini-sidebar">
      <div className={cls("/restaurants")} onClick={() => navigate("/restaurants")}>
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
  );
}
