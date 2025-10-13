import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate("/");
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>WFO Tracker</h2>
      </div>
      <div className="navbar-right">
        <span>{user.displayName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
export default Navbar;
