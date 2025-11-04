// src/components/SignUpButton.jsx
import { useNavigate } from "react-router-dom";

export default function SignUpButton() {
  const navigate = useNavigate();
  return (
    <button
      className="signup-btn"
      onClick={() => navigate("/signup")}
    >
      Sign Up
    </button>
  );
}
