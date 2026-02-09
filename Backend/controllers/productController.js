const Product = require('../models/productModel');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

const uploadImage = (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      success: 0,
      message: "No file uploaded"
    });
  }

  // Upload buffer to Cloudinary using upload_stream
  const uploadStream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
    if (error) {
      console.error('Cloudinary upload error:', error);
      return res.status(500).json({ success: 0, message: 'Image upload failed' });
    }
    if (!result || !result.secure_url) {
      console.error('Cloudinary upload did not return a valid result:', result);
      return res.status(500).json({ success: 0, message: 'Invalid upload result' });
    }
    // Return both secure URL and public_id for later deletion
    return res.status(200).json({ success: 1, image_url: result.secure_url, image_public_id: result.public_id });
  });

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

// Create product — rely on MongoDB _id
const addProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      image_public_id: req.body.image_public_id || undefined,
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

    const { name, image, image_public_id, description, category, stock, new_price, old_price, sizes } = req.body;
    if (name) product.name = name;

    // If a new image was provided, delete the previous one from Cloudinary (best-effort)
    if (image) {
      if (product.image_public_id) {
        try {
          await cloudinary.uploader.destroy(product.image_public_id, { resource_type: 'image' });
        } catch (err) {
          console.error('Failed to delete old Cloudinary image:', err);
        }
      }
      product.image = image;
      product.image_public_id = image_public_id || undefined;
    }

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

// Helper: extract Cloudinary public id from a secure URL (best-effort)
function getPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let publicPath = parts[1];
    // remove version prefix like v123456789/
    publicPath = publicPath.replace(/^v\d+\//, '');
    // strip file extension
    publicPath = publicPath.replace(/\.[^/.]+$/, '');
    return publicPath;
  } catch (e) {
    return null;
  }
}

// Remove product by Mongo _id (admin only)
const removeProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Attempt to remove associated image from Cloudinary (best-effort)
    const publicId = product.image_public_id || getPublicIdFromUrl(product.image);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      } catch (err) {
        console.error('Cloudinary deletion failed:', err);
      }
    }

    await Product.findByIdAndDelete(id);

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
