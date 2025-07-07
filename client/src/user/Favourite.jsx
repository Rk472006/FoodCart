import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FoodProduct from "../components/FoodProduct";
import Navbar from "../components/Navbar";
import "./Favourite.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
export default function Favourite() {
   const [uid, setUid] = useState(null);
  const [favourites, setFavourites] = useState([]);
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
    const fetchFavourites = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_EXPRESS_API}/api/favourites/${uid}`
        );
        setFavourites(res.data.products || []);
      } catch (err) {
        console.error("Error fetching favourites", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites(); // 🔄 Only once on mount
  }, [uid]);

  const removeFromFavourites = async (productId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_EXPRESS_API}/api/favourites/${uid}/remove`,
        { productId }
      );
      setFavourites((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      fetchFavourites();
    } catch (err) {
      console.error("Error removing from favourites", err);
    }
  };

  return (
    <div>
      <Navbar uid={uid} />
      <div className="favourite-page">
        <h2>Your Favourites</h2>
        {loading ? (
          <p className="loading-text">Loading your favourites…</p>
        ) : favourites.length > 0 ? (
          <div className="favourites-grid">
            {favourites.map((product) => (
              <FoodProduct
                key={product._id}
                product={product}
                uid={uid}
                onRemoveFavorite={removeFromFavourites}
              />
            ))}
          </div>
        ) : (
          <p className="no-favourites">No favourites found.</p>
        )}
      </div>
    </div>
  );
}
