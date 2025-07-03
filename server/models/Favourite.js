const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: String,         
    required: true,
    unique: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true       
});

const Favourite = mongoose.model("Favourite", favouriteSchema);

module.exports = Favourite;
