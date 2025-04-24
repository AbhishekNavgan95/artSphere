const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, isFeatured } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingCategory = await ProductCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new ProductCategory({
      name,
      description,
      isFeatured,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("error creating category : ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("error fetching categories : ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await ProductCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("error fetching category by id : ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, isFeatured } = req.body;

    const category = await ProductCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.isFeatured = isFeatured || category.isFeatured;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("error updating category : ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await ProductCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = Product.findOne({ category: categoryId });
    if (product.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category has products, cannot be deleted",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("error deleting category : ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
