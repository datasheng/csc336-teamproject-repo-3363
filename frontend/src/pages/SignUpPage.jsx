import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import { fetchJSON } from "../api";
import usePageTitle from "../hooks/usePageTitle";

export default function SignUpPage() {
  usePageTitle("SnapEats - Sign Up");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") checkPasswordStrength(value);
  };


  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

 
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      setError("⚠️ Please fill in all fields.");
      return;
    }

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("❌ Invalid email address.");
      return;
    }

    
    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    try {
        const user = await fetchJSON("/auth/signup", {
            method: "POST",
            body: JSON.stringify({
                email: form.email,
                password: form.password,
                firstName: form.firstName,
                lastName: form.lastName
            }),
        });
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("🎉 Account created successfully!");
        navigate("/home");
    } catch (err) {
        setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create Account</h1>
        <p className="subtitle">Join our delivery platform today!</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group-row" style={{ display: 'flex', gap: '10px' }}>
            <div className="input-group" style={{ flex: 1 }}>
                <label>First Name</label>
                <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
                <label>Last Name</label>
                <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {passwordStrength && (
              <p className={`password-hint ${passwordStrength.toLowerCase()}`}>
                Password strength: {passwordStrength}
              </p>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login here</span>
        </p>
      </div>
    </div>
  );
}
