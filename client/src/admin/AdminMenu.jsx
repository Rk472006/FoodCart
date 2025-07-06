import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AdminMenu.css"; 

export default function AdminMenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async (token) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    try {
      await axios.delete(`${import.meta.env.VITE_EXPRESS_API}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchProducts(token);
      }
    });
  }, []);

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <>
      <AdminNavbar />
      <div className="admin-menu-container">
        <h2>Manage Menu Products</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id}>
                  <td>{prod.name}</td>
                  <td>{prod.price}</td>
                  <td>{prod.category}</td>
                  <td>{prod.rating?.toFixed(1) || 0}</td>
                  <td>
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="product-image"
                    />
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/admin/edit-product/${prod._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(prod._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
