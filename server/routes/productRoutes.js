const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({deleted:false});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
