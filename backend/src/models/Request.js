const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  equipmentId: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED','ISSUED','RETURNED'], default: 'PENDING' },
  requestDate: { type: Date, default: Date.now },
  approvedBy: String,
  approvedAt: Date,
  issuedAt: Date,
  returnedAt: Date,
  dueDate: Date,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
