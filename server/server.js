const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const productRoutes=require("./routes/productRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const menuRoutes=require("./routes/menuRoutes");
const orderRoutes=require("./routes/orderRoutes");
const cartRoutes=require("./routes/cartRoutes");
const adminRoutes=require("./routes/adminRoutes");
const feedbackRoutes=require("./routes/feedbackRoutes");
const uploadRoute=require("./routes/uploadRoute");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use('/api/user', userRoutes);
app.use('/api',productRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/menu",menuRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use("/api/upload",uploadRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// 🔚 Global error handler — add after all routes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
});
