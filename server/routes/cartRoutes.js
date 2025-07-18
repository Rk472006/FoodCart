const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();


router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const cart = await Cart.findOne({ userUid: uid }).populate("items.productId");

    if (cart) {
      
      cart.items = cart.items.filter(item => item.productId !== null);
      await cart.save(); 
    }

    res.json(cart || { userUid: uid, items: [] });
  } catch (err) {
    console.error("Fetch cart error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});


router.post("/add", async (req, res) => {
  const { uid, productId } = req.body;

  try {
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product does not exist" });
    }

    let cart = await Cart.findOne({ userUid: uid });

    if (!cart) {
      cart = new Cart({
        userUid: uid,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => String(item.productId) === String(productId)
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});


router.post("/remove", async (req, res) => {
  const { uid, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userUid: uid });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (itemIndex === -1)
      return res.status(404).json({ error: "Item not in cart" });

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});


router.post("/delete", async (req, res) => {
  const { uid, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userUid: uid });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => String(item.productId) !== String(productId)
    );

    cart.updatedAt = new Date();

    if (cart.items.length === 0) {
      await Cart.deleteOne({ userUid: uid });
      return res.status(200).json({ message: "Cart emptied and deleted" });
    }

    await cart.save();
    res.status(200).json({ message: "Product deleted from cart", cart });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product from cart" });
  }
});


router.post("/clear", async (req, res) => {
  const { uid } = req.body;

  try {
    const cart = await Cart.findOne({ userUid: uid });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    await Cart.deleteOne({ userUid: uid });

    res.status(200).json({ message: "Cart cleared and deleted" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
