// Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";   
import "./Navbar.css";

export default function Navbar({ uid }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setIsOpen(false);
    signOut(auth)
      .then(() => {
        localStorage.clear();         
        navigate("/", { replace: true });
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="navbar-brand">
          <h2>Food Delivery</h2>
          <div className="hamburger" onClick={toggleMenu}>
            ☰
          </div>
        </div>

        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <Link to={`/search`}     onClick={() => setIsOpen(false)}>Search</Link>
          <Link to={`/menu`}       onClick={() => setIsOpen(false)}>Menu</Link>
          <Link to={`/myorders`}   onClick={() => setIsOpen(false)}>My Orders</Link>
          <Link to={`/cart`}       onClick={() => setIsOpen(false)}>Cart</Link>
          <Link to={`/favourites`} onClick={() => setIsOpen(false)}>Favourites</Link>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
