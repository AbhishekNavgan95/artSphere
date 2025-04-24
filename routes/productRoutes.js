const express = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const { authenticateUser, isArtist } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById);
router.post("/create", authenticateUser, isArtist, createProduct);
router.delete("/delete/:id", authenticateUser, isArtist, deleteProduct);
router.put("/update/:id", authenticateUser, isArtist, updateProduct);

module.exports = router;
