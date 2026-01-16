const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId,
    amount: {
      type: Number,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
