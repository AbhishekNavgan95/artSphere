const express = require("express");
const {
  getAllWorkShops,
  getWorkShopById,
  createWorkShop,
  updateWorkShop,
  deleteWorkShop,
} = require("../controllers/workShop.controller");
const router = express.Router();
const { authenticateUser, isArtist } = require("../middleware/authMiddleware");

router.get("/get", getAllWorkShops);
router.get("/get/:id", getWorkShopById);
router.post("/create", authenticateUser, isArtist, createWorkShop);
router.put("/update/:id", authenticateUser, isArtist, updateWorkShop);
router.delete("/delete/:id", authenticateUser, isArtist, deleteWorkShop);

module.exports = router;
