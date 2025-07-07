import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Orders.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
const MyOrders = () => {
  const [userUid, setUid] = useState(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentUid = user.uid;
        setUid(currentUid);
       
        console.log(currentUid);
      } else {
        
        setUid(null);
       
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!userUid) return;

    const fetchOrdersAndFeedback = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_EXPRESS_API}/api/orders/${userUid}`
        );
        if (res.data.success) {
          const sortedOrders = res.data.orders.sort(
            (a, b) => new Date(b.placedAt) - new Date(a.placedAt)
          );
          setOrders(sortedOrders);

          const feedbackMap = {};
          await Promise.all(
            sortedOrders.map(async (order) => {
              try {
                const feedbackRes = await axios.get(
                  `${import.meta.env.VITE_EXPRESS_API}/api/feedback/check/${userUid}/${order._id}`
                );
                feedbackMap[order._id] = feedbackRes.data.exists;
              } catch (err) {
                console.error(
                  `Error checking feedback for order ${order._id}`,
                  err
                );
              }
            })
          );
          setFeedbackGiven(feedbackMap);
        }
      } catch (error) {
        console.error("Error fetching orders or feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndFeedback();
  }, [userUid]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-container">
      <Navbar uid={userUid} />
      <div className="orders-page">
        <h2>📦 Your Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="horizontal-order-card">
                <div className="order-info">
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.placedAt).toLocaleString()}
                  </p>
                </div>
                <div className="order-meta">
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>

                  {!feedbackGiven[order._id] ? (
                    order.status === "Delivered" ? (
                      <button
                        className="feedback-button"
                        onClick={() =>
                          navigate(`/feedback/${order._id}`)
                        }
                      >
                        Give Feedback
                      </button>
                    ) : (
                      <p className="feedback-status">⏳ Awaiting Delivery</p>
                    )
                  ) : (
                    <p className="feedback-status">✅ Feedback Given</p>
                  )}

                  <button
                    className="summary-button"
                    onClick={() =>
                      navigate(`/myorders/${order._id}`)
                    }
                  >
                    View Summary
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
