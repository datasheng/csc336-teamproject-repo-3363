import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";
import "./AccountPage.css";
import usePageTitle from "../hooks/usePageTitle";

export default function AddressBookPage() {
  usePageTitle("SnapEats - Address Book");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ address: "", contactNum: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return navigate("/");
    const u = JSON.parse(stored);
    setUser(u);
    loadAddresses(u.usrID);
  }, [navigate]);

  const loadAddresses = async (uid) => {
    try {
        const data = await fetchJSON(`/users/${uid}/addresses`);
        setAddresses(data);
    } catch (e) {
        console.error(e);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.address) return;
    try {
        await fetchJSON(`/users/${user.usrID}/addresses`, {
            method: "POST",
            body: JSON.stringify(form)
        });
        setForm({ address: "", contactNum: "" });
        loadAddresses(user.usrID);
        setMsg("✅ Address added");
    } catch (err) {
        setMsg("❌ " + err.message);
    }
  };

  const handleDelete = async (aid) => {
    if (!window.confirm("Remove this address?")) return;
    try {
        await fetchJSON(`/addresses/${aid}`, { method: "DELETE" });
        loadAddresses(user.usrID);
    } catch (err) {
        alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="account-container">
        <h1>Address Book</h1>
        
        <div className="list-container">
            {addresses.length === 0 ? <p>No addresses saved.</p> : (
                <ul className="data-list">
                    {addresses.map(a => (
                        <li key={a.addID} className="data-item column">
                            <div className="addr-info">
                                <strong>📍 {a.address}</strong>
                                {a.contactNum && <span className="sub-text">📞 {a.contactNum}</span>}
                            </div>
                            <button className="delete-icon-btn" onClick={() => handleDelete(a.addID)}>🗑️</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <form className="add-form" onSubmit={handleAdd}>
            <h3>Add New Address</h3>
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Address" 
                    value={form.address} 
                    onChange={e => setForm({...form, address: e.target.value})}
                    required
                />
            </div>
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Contact Number (Optional)" 
                    value={form.contactNum} 
                    onChange={e => setForm({...form, contactNum: e.target.value})}
                />
            </div>
            <button type="submit" className="add-btn-small">Add Address</button>
        </form>
        {msg && <p className="msg-text">{msg}</p>}

        <button className="back-btn-small" onClick={() => navigate("/account")}>⬅ Back to Account</button>
      </div>
    </div>
  );
}

