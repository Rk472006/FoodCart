import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import "./Search.css";
import FoodProduct from "../components/FoodProduct";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Search() {
  const [uid, setUid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, allProducts]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/products`);
      setAllProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  return (
    <>
      <Navbar uid={uid} />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="food-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <FoodProduct key={product._id} product={product} uid={uid} />
          ))
        ) : (
          <p style={{ marginTop: "20px", textAlign: "center" }}>
            No products found.
          </p>
        )}
      </div>
    </>
  );
}
