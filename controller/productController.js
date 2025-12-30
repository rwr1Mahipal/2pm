const Product = require("../model/productModel");

exports.getAllProduct = async (req, res) => {
  try {
    const allProduct = await Product.find({ status: 1 });

    res.status(200).json({
      success: true,
      count: allProduct.length,
      allProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.status === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ message: "Invalid Product ID" });
  }
};

exports.createProducts = async (req, res) => {
  try {
    const { name, productPrice } = req.body;

    if (!name || !productPrice) {
      return res.status(400).json({ message: "Product name & price required" });
    }

    const newProduct = await Product.create({
      name,
      productPrice,
      status: 1,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const { productPrice } = req.body;

    if (!productPrice) {
      return res.status(400).json({ message: "Price required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { productPrice },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProducts = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { status: 0 },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
