const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favourite");
const Product = require("../models/Product");


router.get("/:uid", async (req, res) => {
  try {
    const fav = await Favorite.findOne({ userId: req.params.uid })
      .populate({
        path: "products",
        match: { deleted: false },  
      });

    res.json(fav || { userId: req.params.uid, products: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching favourites", error: err });
  }
});


router.post("/:uid/add", async (req, res) => {
  try {
    const { productId } = req.body;

    
    const product = await Product.findOne({ _id: productId, deleted: false });
    if (!product) {
      return res.status(400).json({ message: "Product not found or has been deleted" });
    }

    let fav = await Favorite.findOne({ userId: req.params.uid });

    if (!fav) {
      fav = new Favorite({ userId: req.params.uid, products: [productId] });
    } else if (!fav.products.some(id => id.toString() === productId.toString())) {
      fav.products.push(productId);
    }

    await fav.save();

    const updatedFav = await Favorite.findOne({ userId: req.params.uid })
      .populate({
        path: "products",
        match: { deleted: false },
      });

    res.json({ message: "Product added to favourites", favourites: updatedFav.products });
  } catch (err) {
    res.status(500).json({ message: "Error adding to favourites", error: err });
  }
});


router.post("/:uid/remove", async (req, res) => {
  try {
    const { productId } = req.body;
    const fav = await Favorite.findOne({ userId: req.params.uid });

    if (!fav) {
      return res.status(404).json({ message: "Favourites not found" });
    }

    fav.products = fav.products.filter(id => id.toString() !== productId);
    await fav.save();

    const updatedFav = await Favorite.findOne({ userId: req.params.uid })
      .populate({
        path: "products",
        match: { deleted: false },
      });

    res.json({ message: "Product removed from favourites", favourites: updatedFav.products });
  } catch (err) {
    res.status(500).json({ message: "Error removing from favourites", error: err });
  }
});

module.exports = router;
