import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase"; 
import { toast } from "react-toastify";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      localStorage.clear();
      toast.success("Logged out successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Try again.");
    }
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
