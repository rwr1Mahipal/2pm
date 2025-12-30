const Cart = require("../model/cartModel");
const Product = require("../model/productModel");

exports.addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;
  if (!quantity || !size) {
    return res
      .status(404)
      .json({ message: "Product quantity and size required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const userId = req.user._id;
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.productPrice,
      size,
    });
  }
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  await cart.save();
  res.status(200).json({ success: true, cart });
};

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  res.status(200).json({ success: true, cart });
};

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  await cart.save();

  res.status(200).json({ success: true, cart });
};
