const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
    
    const { uid, email } = req.body;
    try {
        const user = new User({ uid, email });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("MongoDB error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:uid", async (req, res) => {
  const user = await User.findOne({ uid: req.params.uid });
  if (user) res.json(user);
  else res.status(404).json({ error: "User not found" });
});

module.exports = router;