import React, { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./AddProduct.css"; 

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
    category: "Veg",
    rating: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
  const data = new FormData();
  data.append("image", imageFile);

  const auth = getAuth();
  const user = auth.currentUser;
  const token = await user.getIdToken();
  console.log( "Entering image upload");
  const res = await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, 
    },
  });

  return res.data.imageUrl; 
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    try {
      setUploading(true);

      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary();
      }

      const productData = { ...form, imageUrl };

      await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/admin/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/admin/menu");
    } catch (err) {
      console.error("Failed to add product:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="add-product-container">
        <h2>Add New Product</h2>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Vegan">Vegan</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
          </select>
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={handleChange}
            placeholder="Rating (0.0 - 5.0)"
            required
          />
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
}
