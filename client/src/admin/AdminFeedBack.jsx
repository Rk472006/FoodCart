import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "./AdminFeedback.css";

export default function AdminFeedBack() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/feedback/all");
        if (res.data.success) {
          setFeedbacks(res.data.feedbacks);
          console.log("Fetched feedbacks ratings:", res.data.feedbacks);
        } else {
          console.error("Failed to fetch feedbacks");
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <div className="loading">Loading feedbacks...</div>;

  return (
    <div className="admin-feedback-container">
      <AdminNavbar />
      <h2 className="title">📝 Customer Feedbacks</h2>

      {feedbacks.length === 0 ? (
        <p className="empty-state">No feedbacks available.</p>
      ) : (
        <div className="feedback-flex-grid">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="feedback-card">
              <p><strong>User:</strong> {fb.userEmail || "Unknown User"}</p>
              <p><strong>Order ID:</strong> {fb.orderId}</p>
              <p><strong>Feedback:</strong> {fb.feedbackText || "No feedback"}</p>
              <p><strong>Date:</strong> {new Date(fb.createdAt).toLocaleString()}</p>
              <p><strong>Ratings:</strong></p>
              <ul>
                {Array.isArray(fb.ratings) && fb.ratings.length > 0 ? (
                  fb.ratings.map((r) => (
                    <li key={r.productId}>
                      {r.productName} : {r.rating}⭐
                    </li>
                  ))
                ) : (
                  <li>No product ratings.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
