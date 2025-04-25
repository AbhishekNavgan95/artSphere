const Product = require("../models/Product");
const fs = require("fs");
const {
  uploadImageTocloudinary,
  deleteFromCloudinary,
} = require("../utils/imageUpload");

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, isAvailable } = req.body;
    const { id: artist } = req.user;
    const files = req.files?.images;

    if (!title || !description || !price || !category || !artist || !files) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields and upload at least one image",
      });
    }

    const uploadedImages = [];

    // Ensure files is an array (in case of single image it can be an object)
    const imagesArray = Array.isArray(files) ? files : [files];

    for (let file of imagesArray) {
      const uploadResult = await uploadImageTocloudinary(file, "products");
      uploadedImages.push({
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
      fs.unlinkSync(file.tempFilePath); // clean up temp file
    }

    // console.log("uploarded images : ", uploadedImages);

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      artist,
      isAvailable: isAvailable || true,
      images: uploadedImages,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { id } = req.user;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.artist.toString() !== id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const publicIds = product.images.map((img) => img.public_id);
    await deleteFromCloudinary(publicIds);

    await Product.findByIdAndDelete(productId);

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { id } = req.user;
    const { title, description, price, category, isAvailable } = req.body;
    const files = req.files?.images;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.artist.toString() !== id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (files) {
      const publicIds = product.images.map((img) => img.public_id);
      await deleteFromCloudinary(publicIds);

      const uploadedImages = [];

      for (let file of files) {
        const uploadResult = await uploadImageTocloudinary(file, "products");
        uploadedImages.push({
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
        fs.unlinkSync(file.tempFilePath);
      }

      product.images = uploadedImages;
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.isAvailable = isAvailable || product.isAvailable;

    const updatedProduct = await product.save();

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category artist");

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "category artist"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
