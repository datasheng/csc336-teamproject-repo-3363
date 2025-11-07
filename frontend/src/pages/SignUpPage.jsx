import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

 
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

 
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
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

   
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.find((u) => u.email === form.email);

    if (exists) {
      setError("⚠️ This email is already registered.");
      return;
    }

    users.push({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    localStorage.setItem("users", JSON.stringify(users));

    
    alert("🎉 Account created successfully!");
    navigate("/restaurants"); 
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create Account</h1>
        <p className="subtitle">Join our delivery platform today!</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
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
