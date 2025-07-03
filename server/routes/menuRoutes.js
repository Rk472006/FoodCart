const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const { category, sortBy, order = "asc" } = req.query;

  const query = { deleted: false };  

  if (category && category !== "All") {
    query.category = category;
  }

  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === "desc" ? -1 : 1;
  }

  try {
    const products = await Product.find(query).sort(sortOptions);
    res.json({products });
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
