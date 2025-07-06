import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FoodProduct from '../components/FoodProduct';
import './Menu.css';

export default function Menu() {
  const { uid } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const params = {};

        if (categoryFilter !== "All") {
          params.category = categoryFilter;
        }

        if (sortOption) {
          const [sortBy, order] = sortOption.split("-");
          params.sortBy = sortBy;
          params.order = order;
        }

        const response = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/menu`, { params });
        setMenuItems(response.data.products || []);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [categoryFilter, sortOption]);

  return (
    <div>
      <Navbar uid={uid || ""} />
      <div className="menu-page">
        <div className="menu-controls">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Vegan">Vegan</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
          </select>

          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>

        <div className="menu-grid">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <FoodProduct key={item._id} product={item} uid={uid || ""} />
            ))
          ) : (
            <p>No menu items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
