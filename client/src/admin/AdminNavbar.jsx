import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__brand">Admin Panel</div>
      <ul className="admin-navbar__links">
        <li onClick={() => navigate("/admin/orders")}>Orders</li>
        <li onClick={() => navigate("/admin/menu")}>Menu</li>
        <li onClick={() => navigate("/admin/add-product")}>Add Product</li>
        <li onClick={() => navigate("/admin/feedback")}>Feedbacks</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
}
