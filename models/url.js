const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String, // Base64 data URL of the image
  },
  visitHistory: [{ timestamp: { type: Number } }],
}, { timestamps: true });

const URL = mongoose.model("url", urlSchema);
module.exports = URL;
