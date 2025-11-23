import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";
import "./AccountPage.css"; // Reuse existing styles
import usePageTitle from "../hooks/usePageTitle";

export default function ProfileEditPage() {
  usePageTitle("SnapEats - Edit Profile");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", password: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return navigate("/");
    const u = JSON.parse(stored);
    setUser(u);
    setForm(f => ({ ...f, firstName: u.firstName, lastName: u.lastName }));
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    
    if (form.password && form.password !== form.confirmPassword) {
        setMsg("❌ Passwords do not match");
        return;
    }

    try {
        const payload = {
            firstName: form.firstName,
            lastName: form.lastName
        };
        if (form.password) payload.password = form.password;

        await fetchJSON(`/users/${user.usrID}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        });

        // Update local storage
        const updated = { ...user, firstName: form.firstName, lastName: form.lastName };
        localStorage.setItem("currentUser", JSON.stringify(updated));
        setMsg("✅ Profile updated successfully!");
    } catch (err) {
        setMsg("❌ " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
        await fetchJSON(`/users/${user.usrID}`, { method: "DELETE" });
        localStorage.clear(); // Clear all data
        navigate("/");
    } catch (err) {
        alert("Failed to delete: " + err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="account-container">
        <h1>Edit Profile</h1>
        
        <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-group">
                <label>Email (Cannot be changed)</label>
                <input type="text" value={user.email} disabled className="disabled-input"/>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>First Name</label>
                    <input 
                        type="text" 
                        value={form.firstName} 
                        onChange={e => setForm({...form, firstName: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input 
                        type="text" 
                        value={form.lastName} 
                        onChange={e => setForm({...form, lastName: e.target.value})}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>New Password (Leave blank to keep current)</label>
                <input 
                    type="password" 
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})}
                />
            </div>
            {form.password && (
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                        type="password" 
                        value={form.confirmPassword} 
                        onChange={e => setForm({...form, confirmPassword: e.target.value})}
                    />
                </div>
            )}

            {msg && <p className="msg-text">{msg}</p>}

            <div className="btn-row">
                <button type="button" className="cancel-btn" onClick={() => navigate("/account")}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
            </div>
        </form>

        <hr className="divider"/>
        
        <div className="danger-zone">
            <h3>Danger Zone</h3>
            <button className="delete-account-btn" onClick={handleDelete}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

