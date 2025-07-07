import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './OrderSummary.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
const OrderSummary = () => {
  const {  orderId:orderId } = useParams();
  const navigate = useNavigate();
  const [userUid, setUid] = useState(null);
  const [order, setOrder] = useState(null);
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
    if (!userUid || !orderId) return;

    const fetchOrder = async () => {
      try {
       const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/orders/${userUid}/${orderId}`);
        
        if (res.data.success) {
          setOrder(res.data.order);
          console.log('Fetched order:', res.data.order);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [userUid, orderId]);

  
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-summary-container">
      <Navbar uid={userUid} />
      <div className="order-summary-page">
      <div className="order-summary-box">
        <h2>📄 Order Summary</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.placedAt).toLocaleString()}</p>

        <div className="delivery-section">
          <h3>Delivery Details</h3>
          <p><strong>Name:</strong> {order.deliveryDetails.name}</p>
          <p><strong>Phone:</strong> {order.deliveryDetails.phone}</p>
          <p><strong>Address:</strong> {order.deliveryDetails.addressLine1}, {order.deliveryDetails.addressLine2 && `${order.deliveryDetails.addressLine2}, `}{order.deliveryDetails.city}, {order.deliveryDetails.state} - {order.deliveryDetails.pincode}, {order.deliveryDetails.country}</p>
        </div>

        <div className="items-section">
          <h3>Ordered Items</h3>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx} className="summary-item">
                <img src={item.imageUrl} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.priceAtPurchase}</p>
                  <p>Subtotal: ₹{item.quantity * item.priceAtPurchase}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="total-section">
          <h3>Total: ₹{order.totalAmount}</h3>
        </div>

        <button onClick={() => navigate(`/myorders`)} className="back-btn">← Back to Orders</button>
      </div>
      </div>
    </div>
  );
};

export default OrderSummary;
