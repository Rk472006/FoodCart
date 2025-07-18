const express = require("express");
const router = express.Router();
const Feedback = require("../models/FeedBack");

const User = require("../models/user");
const Product = require("../models/Product");
router.get("/check/:userId/:orderId", async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    const feedback = await Feedback.findOne({ userId, orderId });
    return res.json({ success: true, exists: !!feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { userId, orderId, ratings, feedbackText } = req.body;

  if (!userId || !orderId || !ratings) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }

  try {
    const existing = await Feedback.findOne({ userId, orderId });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Feedback already submitted." });
    }

    const feedback = new Feedback({
      userId,
      orderId,
      ratings,
      feedbackText,
    });

    await feedback.save();
    return res.status(201).json({ success: true, message: "Feedback saved." });
  } catch (err) {
    console.error("Error saving feedback:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

router.get("/all", async (req, res) => {
  try {
    
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    
    const users = await User.find();
    const products = await Product.find();

    
    const userMap = {};
    const productMap = {};

    
    users.forEach((user) => {
      userMap[user.uid] = user.email || "Unknown User";
    });

    
    products.forEach((product) => {
      productMap[product._id.toString()] = product.name || "Unnamed Product";
    });

    
    const detailedFeedbacks = feedbacks.map((fb) => {
      const transformedRatings = Object.entries(fb.ratings || {})
        .filter(([key]) => !key.startsWith("__$")) 
        .map(([productId, rating]) => {
          const productName = productMap[productId];
          if (!productName) {
            console.warn(`⚠️ Product ID not found in map: ${productId}`);
          }

          return {
            productId,
            productName: productName || "Unknown Product",
            rating,
          };
        });

      return {
        _id: fb._id,
        userEmail: userMap[fb.userId] || "Unknown User", 
        orderId: fb.orderId,
        feedbackText: fb.feedbackText,
        createdAt: fb.createdAt,
        ratings: transformedRatings,
      };
    });

    console.log("✅ Feedbacks fetched successfully.");
    return res.json({ success: true, feedbacks: detailedFeedbacks });
  } catch (err) {
    console.error("❌ Feedback fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
