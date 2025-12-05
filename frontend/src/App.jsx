import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import AddressBookPage from "./pages/AddressBookPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx"; // ✅ 加入 Checkout 页面

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <Routes>
      
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

      
        <Route path="/home" element={<HomePage />} /> {/* ✅ 改名匹配 LoginPage */}
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} /> {/* ✅ 新增结账页 */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/profile-edit" element={<ProfileEditPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/address-book" element={<AddressBookPage />} />
      </Routes>
    </BrowserRouter>
  );
}
