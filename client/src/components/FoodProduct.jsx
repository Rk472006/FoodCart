import React, { useState, useEffect } from "react";
import axios from "axios";

import "./FoodProduct.css";

export default function FoodProduct({ product, uid }) {
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
    checkIfInCart();
  }, []);

  const addToCart = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/cart/add`, {
        uid,
        productId: product._id,
      });
      setIsInCart(true);
      console.log("Product added to cart");
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const removeFromCart = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/cart/delete`, {
      uid,
      productId: product._id,
    });
    setIsInCart(false);
    console.log("Product completely deleted from cart");
  } catch (err) {
    console.error("Failed to delete from cart", err);
  }
};


  const toggleFavorite = async () => {
    try {
      if (!isFavorite) {
        await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/favourites/${uid}/add`, {
          productId: product._id,
        });
        setIsFavorite(true);
        console.log("Added to favorites");
      } else {
        await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/favourites/${uid}/remove`, {
          productId: product._id,
        });
        setIsFavorite(false);
        console.log("Removed from favorites");
      }
    } catch (err) {
      console.error("Error updating favorites", err);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/favourites/${uid}`);
      const isFav = res.data.products.some((p) => p._id === product._id);
      setIsFavorite(isFav);
    } catch (err) {
      console.error("Error checking favorite status", err);
    }
  };

  const checkIfInCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/cart/${uid}`);
      const isPresent = res.data.items.some(
        (item) => item.productId._id === product._id
      );
      setIsInCart(isPresent);
    } catch (err) {
      console.error("Error checking cart status", err);
    }
  };

  return (
    <div className="food-product">
      <div className="image-container">
        <img src={product.imageUrl} alt={product.name} />
        <span className="favorite-icon" onClick={toggleFavorite}>
          {isFavorite ? "❤️" : "🤍"}
        </span>
      </div>
      <h3>{product.name}</h3>
      <p>Rating: {product.rating}</p>
      <p>Price: ${product.price}</p>

      <button onClick={isInCart ? removeFromCart : addToCart}>
        {isInCart ? "Remove from Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
