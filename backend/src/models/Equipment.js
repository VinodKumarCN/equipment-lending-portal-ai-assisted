const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  condition: String,
  totalQty: { type: Number, default: 1 },
  availableQty: { type: Number, default: 1 },
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Equipment", equipmentSchema);
