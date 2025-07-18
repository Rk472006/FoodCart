const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyAdmin = require("../middleware/verifyAdmin");

const Product = require("../models/Product");
const UserOrder = require("../models/userOrder");
const User = require("../models/user");

router.get("/products", verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find({ deleted: false }); 
    res.json({ products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

 
router.get("/products/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid product ID" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ product });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/products", verifyAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(400).json({ error: "Invalid product data", details: err.message });
  }
});


router.put("/products/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid product ID" });

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/products/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid product ID" });

    const deleted = await Product.findByIdAndUpdate(id, { deleted: true }, { new: true }); 

    if (!deleted) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product soft-deleted" });
  } catch (err) {
    console.error("Error soft-deleting product:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.get("/orders", verifyAdmin, async (req, res) => {
  try {
    const allOrders = await UserOrder.find();

    const orders = allOrders.flatMap((userOrder) =>
      userOrder.orders.map((order) => ({
        ...order.toObject(),
        userUid: userOrder.userUid,
      }))
    );

    const userMap = {};
    const users = await User.find({}, "uid email");
    users.forEach((u) => (userMap[u.uid] = u.email));

    orders.forEach((o) => {
      o.userEmail = userMap[o.userUid] || "Unknown";
      o.total = o.totalAmount;
      o.createdAt = o.placedAt;
    });

    res.json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/order/:uid/:orderId", verifyAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status)
      return res.status(400).json({ error: "Order ID and status required" });

    const allOrders = await UserOrder.find();
    let updated = false;

    for (const userOrder of allOrders) {
      const order = userOrder.orders.id(orderId);
      if (order) {
        order.status = status;
        await userOrder.save();
        updated = true;
        break;
      }
    }

    if (!updated) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
