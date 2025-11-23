import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { fetchJSON } from "../api";
import usePageTitle from "../hooks/usePageTitle";

export default function LoginPage() {
  usePageTitle("SnapEats - Sign in");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setError("");

    try {
      const user = await fetchJSON("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <input
          type="email"
          placeholder="Email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}

        <div className="button-row">
          <button className="login-btn" onClick={handleLogin}>
            Sign In
          </button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
