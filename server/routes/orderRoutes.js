const express = require("express");
const router = express.Router();
const UserOrder = require("../models/userOrder");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


router.post("/place", async (req, res) => {
  const { uid, deliveryDetails } = req.body;
  console.log("Received order payload:", req.body);

  try {
    const cart = await Cart.findOne({ userUid: uid }).populate("items.productId");
     console.log("Fetched cart:", JSON.stringify(cart, null, 2));

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    
    const orderItems = cart.items
      .filter((item) => item.productId !== null)
      .map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        imageUrl: item.productId.imageUrl,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
      }));

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart contains only invalid or deleted products.",
      });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0
    );

    const newOrder = {
      items: orderItems,
      deliveryDetails,
      totalAmount,
      placedAt: new Date(),
    };

    
    let userOrder = await UserOrder.findOne({ userUid: uid });

    if (userOrder) {
      userOrder.orders.push(newOrder);
    } else {
      userOrder = new UserOrder({
        userUid: uid,
        orders: [newOrder],
      });
    }

    await userOrder.save();


    await Cart.deleteOne({ userUid: uid });

    res.status(200).json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.error("❌ Order placement failed:", err);
    res.status(500).json({ success: false, message: "Server error placing order" });
  }
});


router.get("/:uid", async (req, res) => {
  try {
    const userOrder = await UserOrder.findOne({ userUid: req.params.uid });

    if (!userOrder) {
      return res.json({ success: true, orders: [] });
    }

    res.json({ success: true, orders: userOrder.orders });
  } catch (err) {
    console.error("❌ Failed to fetch user orders:", err);
    res.status(500).json({ success: false, message: "Server error fetching orders" });
  }
});
router.get("/:uid/:orderId", async (req, res) => {
  const { uid, orderId } = req.params;

  try {
    const userOrder = await UserOrder.findOne({ userUid: uid });

    if (!userOrder) {
      console.log("❌ No userOrder for:", uid);
      return res.status(404).json({ success: false, message: "User has no orders" });
    }

    console.log("✅ Looking for order:", orderId);
    console.log("📦 Orders available:", userOrder.orders.map(o => o._id.toString()));

    const order = userOrder.orders.id(orderId); // ✅ Recommended way

    if (!order) {
      console.log("❌ Order not found:", orderId);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });

  } catch (err) {
    console.error("❌ Error fetching single order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports=router;