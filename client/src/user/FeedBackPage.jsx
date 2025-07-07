import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import "./FeedbackPage.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
const FeedbackPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [userId, setUid] = useState(null);
  const [ratings, setRatings] = useState({});
  const [feedbackText, setFeedbackText] = useState("");
  const [orderDetails, setOrderDetails] = useState({});
  const [authLoading, setAuthLoading] = useState(true); 
    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentUid = user.uid;
        setUid(currentUid);
       
        console.log(currentUid);
      } else {
        
        setUid(null);
       
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const handleRating = (productId, rating) => {
    setRatings((prev) => ({ ...prev, [productId]: rating }));
  };

  const handleSubmit = async () => {
    if (Object.keys(ratings).length !== orderDetails.items?.length) {
      toast.error("Please rate all the products.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/feedback`, {
        userId,
        orderId,
        ratings,
        feedbackText,
      });

      toast.success("Feedback submitted successfully!");
        navigate(`/myorders`);
    } catch (err) {
      toast.error("Failed to submit feedback.");
    }
  };

 
useEffect(() => {
  if (authLoading||!userId || !orderId) return;          

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_EXPRESS_API}/api/orders/${userId}/${orderId}`
      );
      if (res.data.success) setOrderDetails(res.data.order);
      else toast.error("Failed to fetch order details.");
    } catch (err) {
      console.error("Error fetching order details:", err);
      toast.error("Error fetching order details.");
    }
  };

  fetchOrderDetails();
}, [userId, orderId]);                      


  return (
    <div className="feedback-page">
      <Navbar uid={userId} />
      <div className="feedback-container">
        <h2 className="feedback-heading">Leave Feedback</h2>

        {orderDetails?.items?.map((product) => (
          <div key={product.productId} className="product-card">
            <div className="product-info">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />

            
              <div>
                <h3 className="product-name">{product.name}</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        ratings[product.productId] >= star ? "filled" : ""
                      }`}
                      onClick={() => handleRating(product.productId, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Write your overall feedback..."
          className="feedback-textarea"
        />

        <button onClick={handleSubmit} className="submit-button">
          Submit Feedback
        </button>
        <button onClick={() => navigate(`/myorders`)}>
          Back to Orders
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FeedbackPage;
