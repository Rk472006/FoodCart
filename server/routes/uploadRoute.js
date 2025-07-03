const express = require("express");
const upload = require("../middleware/upload"); // multer + cloudinary
const verifyAdmin = require("../middleware/verifyAdmin"); // middleware that checks Firebase token and admin role

const router = express.Router();

router.post("/", verifyAdmin, upload.single("image"), (req, res) => {
    console.log(process.env.CLOUD_NAME,process.env.CLOUD_API_KEY);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Uploaded file details:", req.file);

    console.log("Upload Route");
    res.status(200).json({ imageUrl: req.file.path });
  } catch (err) {
    console.error("Upload error:", err);
    console.log("Upload error:", JSON.stringify(err, null, 2));

    res.status(500).json({ error: "Something went wrong during upload." });
  }
});

module.exports = router;
