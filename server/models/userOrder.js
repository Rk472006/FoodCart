const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: String,
  imageUrl: String,
  quantity: {
    type: Number,
    required: true
  },
  priceAtPurchase: {
    type: Number,
    required: true
  }
}, { _id: false });

const deliveryDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: "India" }
}, { _id: false });

const singleOrderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  deliveryDetails: deliveryDetailsSchema,
  totalAmount: Number,
  status: {
    type: String,
    default: "Pending"
  },
  placedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true }); 

const userOrdersSchema = new mongoose.Schema({
  userUid: {
    type: String,
    required: true,
    unique: true
  },
  orders: [singleOrderSchema]
});

module.exports = mongoose.model("UserOrder", userOrdersSchema);
