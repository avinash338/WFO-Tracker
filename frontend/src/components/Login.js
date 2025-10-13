import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <h2 className="login-title">🚀 Work From Office Tracker</h2>
      <button className="login-btn" onClick={handleLogin}>
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="google-icon"
        />
        Login with Google
      </button>
    </div>
  );
}
export default Login;
