import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import "./Search.css";
import FoodProduct from "../components/FoodProduct";
import axios from "axios";

export default function Search() {
  const { uid } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

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
      const res = await axios.get("http://localhost:5000/api/products");
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
