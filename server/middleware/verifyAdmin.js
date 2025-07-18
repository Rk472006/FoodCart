
const admin = require("../utils/firebase");
const User = require("../models/user");

const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const idToken = authHeader.split(" ")[1];

    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;


    const user = await User.findOne({ uid });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied: Not an admin" });
    }

    console.log("✅ Admin verified:", user.email);
    req.user = user;
    return next(); 

  } catch (error) {
    console.error("❌ verifyAdmin error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyAdmin;
