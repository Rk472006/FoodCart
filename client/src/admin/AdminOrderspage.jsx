import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css"; // 👈 Import the CSS

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchOrders(token);
      }
    });
  }, []);

  const updateStatus = async (userUid, orderId, newStatus) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    try {
      await axios.put(
        `http://localhost:5000/api/admin/order/${userUid}/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) return <p className="loading-text">Loading orders...</p>;

  return (
    <>
      <AdminNavbar />
      <div className="admin-orders-container">
        <h2>All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User Email</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Placed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userEmail || "N/A"}</td>
                  <td>{order.totalAmount}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.userUid, order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>{new Date(order.placedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/admin/order-summary/${order.userUid}/${order._id}`)
                      }
                    >
                      View Summary
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
