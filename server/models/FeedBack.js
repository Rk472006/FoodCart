const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: String,
  feedbackText: String,
  ratings: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
