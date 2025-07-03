const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  isAdmin:{type:Boolean,default: false}
});

module.exports = mongoose.model("User", userSchema);
