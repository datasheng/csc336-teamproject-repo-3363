// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // 
import SignInButton from "../components/SignInButton.jsx";
import SignUpButton from "../components/SignUpButton.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      navigate("/restaurants"); // 
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <input
          type="text"
          placeholder="Username"
          className="input-box"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-row">
          
          <SignInButton onClick={handleLogin} />
          <SignUpButton />
        </div>
      </div>
    </div>
  );
}
