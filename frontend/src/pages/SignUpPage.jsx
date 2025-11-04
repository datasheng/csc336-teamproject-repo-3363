// src/pages/SignUpPage.jsx
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="login-box">
        <h2>Sign Up Page</h2>
        <p>（edit）</p>

        <button
          className="login-btn"
          onClick={() => navigate("/")}
          style={{ marginTop: "20px" }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
