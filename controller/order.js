const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const Order = require("../model/orderModel");
const User = require("../model/userModel");
const dotenv = require("dotenv");
const Cart = require("../model/cartModel");
dotenv.config();

exports.order = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    amount = cart.totalPrice;
    if (!cart || cart.items.length == 0) {
      return res.status(400).json({ message: "Cart not found" });
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    const order = await Order.create({
      user: req.user._id,
      amount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    });
    res.status(200).json({ success: true, razorpayOrder, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
        paymentStatus: "pending",
      },
      {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or already paid" });
    }

    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [], totalPrice: 0 }
    );

    res.status(200).json({
      success: true,
      message: "Payment successful",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
