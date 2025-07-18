import React, { useEffect, useState } from "react";
import "./Checkout.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
export default function Checkout() {
  const [uid, setUid] = useState(null);
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
  });

  const navigate = useNavigate();
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
    axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/cart/${uid}`).then((res) => {
      setCart(res.data);
    });
  }, [uid]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getTotal = () =>
    cart && cart.items ? cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    ) : 0;

  const placeOrder = async (e) => {
    e.preventDefault();
  if (!form.name || !form.phone || !form.addressLine1 || !form.city || !form.pincode || !form.state) {
    alert("Please fill in all required delivery fields.");
    return;
  }

  try {
    const res = await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/orders/place`, {
      uid,
      deliveryDetails: form,
    });

    if (res.data.success) {
      alert("Order placed successfully!");
      setCart(null); 
      setForm({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        pincode: "",
        state: "",
        country: "India",
      });
    } else {
      alert("Failed to place order. Please try again.");
    }
  } catch (err) {
    console.error("Failed to place order:", err);
    alert("Something went wrong while placing your order.");
  }
};


 

  return (
    <>
      <Navbar uid={uid} />
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Delivery Information</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={form.addressLine1}
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2 (Optional)"
            value={form.addressLine2}
            onChange={handleInput}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleInput}
            required
          />
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <ul>
            {cart && cart.items && cart.items.map((item) => (
              <li key={item.productId._id}>
                {item.productId.name} × {item.quantity} = ₹
                {item.quantity * item.productId.price}
              </li>
            ))}
          </ul>
          <h3>Total: ₹{getTotal().toFixed(2)}</h3>
          <button className="place-order-btn" onClick={placeOrder} disabled={!cart || cart.items.length === 0}>
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}
