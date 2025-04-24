const express = require("express");
const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/productCategory.controller");
const { authenticateUser, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/get", getAllCategories);
router.get("/get/:id", getCategoryById);
router.post("/create", authenticateUser, isAdmin, createCategory);
router.put("/update/:id", authenticateUser, isAdmin, updateCategory);
router.delete("/delete/:id", authenticateUser, isAdmin, deleteCategory);

module.exports = router;
