import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams,useNavigate } from "react-router-dom";
import "./Cart.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
export default function Cart() {
  const [uid, setUid] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentUid = user.uid;
        setUid(currentUid);
        
        console.log(currentUid);
      } else {
        toast.error("You must be logged in to view the Bin.");
        setUid(null);
      
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/cart/${uid}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, action) => {
    try {
      const endpoints = {
        add: `${import.meta.env.VITE_EXPRESS_API}/api/cart/add`,
        remove: `${import.meta.env.VITE_EXPRESS_API}/api/cart/remove`,
        delete: `${import.meta.env.VITE_EXPRESS_API}/api/cart/delete`,
      };

      await axios.post(endpoints[action], { uid, productId });
      fetchCart();
    } catch (err) {
      console.error(`Error during ${action} cart update`, err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/cart/clear`, { uid });
      fetchCart();
    } catch (err) {
      console.error("Error clearing cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [uid]);

  if (loading) {
    return (
      <>
        <Navbar uid={uid} />
        <p className="loading">Loading cart...</p>
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar uid={uid} />
        <p className="empty-cart-message">Your cart is empty.</p>
      </>
    );
  }

  const getTotal = () =>
    cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

  return (
    <>
     <Navbar uid={uid} />
    <div className="cart-container">
     
      <h2 className="cart-title">Your Cart</h2>
      <ul className="cart-list">
        {cart.items.map((item) => (
          <li key={item.productId._id} className="cart-item">
            <img
              src={item.productId.imageUrl}
              alt={item.productId.name}
              className="cart-image"
            />
            <div className="cart-details">
              <h3>{item.productId.name}</h3>
              <p>Price: ${item.productId.price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div className="cart-actions">
              <button onClick={() => updateCart(item.productId._id, "add")}>
                +
              </button>
              <button onClick={() => updateCart(item.productId._id, "remove")}>
                -
              </button>
              <button
                onClick={() => updateCart(item.productId._id, "delete")}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="cart-total">Total: ${getTotal().toFixed(2)}</h3>
      <div className="cart-actions-container">
      <button className="place-order-button" onClick={() => {Navigate(`/checkout`)}}>Check out</button>
      <button className="clear-cart-button" onClick={clearCart}>
        Clear Cart
      </button>
      </div>
    </div>
    </>
  );
}
