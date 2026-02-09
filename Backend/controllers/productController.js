const Product = require('../models/productModel');

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: 0,
      message: "No file uploaded"
    });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  return res.status(200).json({
    success: 1,
    image_url: imageUrl
  });
};

// Create product — rely on MongoDB _id
const addProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description || "",
      category: req.body.category,
      stock: req.body.stock ?? 0,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : []
    });
    await product.save();
    return res.status(201).json({
      success: true,
      product
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      products
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// Get single product by Mongo _id
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    return res.status(200).json({
      success: true,
      product
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// Update product by Mongo _id (admin only)
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const { name, image, description, category, stock, new_price, old_price, sizes } = req.body;
    if (name) product.name = name;
    if (image) product.image = image;
    if (description != null) product.description = description;
    if (category) product.category = category;
    if (stock != null) product.stock = stock;
    if (new_price) product.new_price = new_price;
    if (old_price) product.old_price = old_price;
    if (Array.isArray(sizes)) product.sizes = sizes;

    await product.save();
    return res.status(200).json({
      success: true,
      id,
      message: "Product updated"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// Remove product by Mongo _id (admin only)
const removeProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    return res.status(200).json({
      success: true,
      id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

module.exports = {
  uploadImage,
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  removeProduct,
};
