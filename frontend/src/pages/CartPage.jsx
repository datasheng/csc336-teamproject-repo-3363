import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import usePageTitle from "../hooks/usePageTitle";

export default function CartPage() {
  usePageTitle("SnapEats - Cart");
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("snapEats_cart");
    if (stored) {
        const parsed = JSON.parse(stored);
        setCart(parsed);
        // Default select all? Or none? Let's select none to force choice, or all.
        // setSelectedIds(new Set(parsed.map(i => i.id)));
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("snapEats_cart", JSON.stringify(newCart));
    // Remove deleted items from selection
    const newIds = new Set(newCart.map(i => i.id));
    setSelectedIds(prev => {
        const next = new Set();
        prev.forEach(id => { if(newIds.has(id)) next.add(id); });
        return next;
    });
  };

  const handleRemove = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    updateCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleCheckout = () => {
    const selectedItems = cart.filter(i => selectedIds.has(i.id));
    if (selectedItems.length === 0) {
        alert("Please select items to checkout.");
        return;
    }

    const restIds = new Set(selectedItems.map(i => i.restID));
    if (restIds.size > 1) {
        alert("Please order from only one restaurant at a time.");
        return;
    }

    navigate("/checkout", { state: { items: selectedItems } });
  };

  // Group by Restaurant
  const groups = cart.reduce((acc, item) => {
    const rid = item.restID || "unknown";
    if (!acc[rid]) acc[rid] = { name: item.restName || "Unknown Restaurant", items: [] };
    acc[rid].items.push(item);
    return acc;
  }, {});

  const total = cart
    .filter(i => selectedIds.has(i.id))
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <p className="empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {Object.keys(groups).map(rid => (
                <div key={rid} className="restaurant-group">
                    <h3 className="group-title">{groups[rid].name}</h3>
                    {groups[rid].items.map((item) => (
                        <div key={item.id} className="cart-item">
                        <div className="checkbox-col">
                            <input 
                                type="checkbox" 
                                checked={selectedIds.has(item.id)} 
                                onChange={() => toggleSelect(item.id)}
                            />
                        </div>
                        <div className="item-info">
                            <h3>{item.name}</h3>
                            <p>${Number(item.price).toFixed(2)}</p>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => handleQuantityChange(item.id, -1)}>
                            −
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)}>
                            ＋
                            </button>
                            <button
                            className="remove-btn"
                            onClick={() => handleRemove(item.id)}
                            >
                            ✕
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p className="total">Total (Selected): ${total.toFixed(2)}</p>
              
              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
