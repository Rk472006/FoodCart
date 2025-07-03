import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
export default function Navbar({ uid }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="navbar-brand">
          <h2>Food Delivery</h2>
          <div className="hamburger" onClick={toggleMenu}>☰</div>
        </div>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to={`/search/${uid}`} onClick={() => setIsOpen(false)}>Search</Link>
          <Link to={`/menu/${uid}`} onClick={() => setIsOpen(false)}>Menu</Link>
          <Link to={`/myorders/${uid}`} onClick={() => setIsOpen(false)}>My Orders</Link>
          <Link to={`/cart/${uid}`} onClick={() => setIsOpen(false)}>Cart</Link>
          <Link to={`/favourites/${uid}`} onClick={() => setIsOpen(false)}>Favourites</Link>
          <button className="logout-btn" onClick={() =>{ setIsOpen(false);
            localStorage.clear();
            navigate('/', { replace: true });}}>
          Logout</button>
        </div>
      </div>
    </nav>
  );
}
