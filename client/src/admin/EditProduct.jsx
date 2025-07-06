import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import AdminNavbar from "./AdminNavbar";
import "./EditProduct.css"; // 👈 Import the CSS

export default function EditProductPage() {
  const { productId: id } = useParams();
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const fetchProduct = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data.product);
    };
    fetchProduct();
  }, [id]);

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
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary();
      }

      const updatedForm = { ...form, imageUrl };

      await axios.put(`${import.meta.env.VITE_EXPRESS_API}/api/admin/products/${id}`, updatedForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/menu");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!form) return <p className="loading-text">Loading product...</p>;

  return (
    <>
      <AdminNavbar />
      <div className="edit-product-container">
        <h2>Edit Product</h2>
        <form className="edit-product-form" onSubmit={handleSubmit}>
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

          <label>Current Image:</label>
          <img src={form.imageUrl} alt="Current" className="current-product-image" />

          <input type="file" accept="image/*" onChange={handleImageChange} />

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

          <button type="submit">Update Product</button>
        </form>
      </div>
    </>
  );
}
