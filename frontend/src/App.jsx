import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";


import Sidebar from "./components/Sidebar.jsx";


import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import RestaurantSelection from "./pages/RestaurantSelection.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      
      <Sidebar />

      <Routes>
       
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

       
        <Route path="/restaurants" element={<RestaurantSelection />} />
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </BrowserRouter>
  );
}
