const express = require("express");

const router = express.Router();

const {
  authenticateUser,
  isCustomer,
} = require("../middleware/authMiddleware");
const {
  addProductToCard,
  removeProductFromCard,
  getCart,
  emptyCart,
} = require("../controllers/cart.controller");

router.get("/get", authenticateUser, isCustomer, getCart);
router.post("/add", authenticateUser, isCustomer, addProductToCard);
router.post("/remove", authenticateUser, isCustomer, removeProductFromCard);
router.post("/empty", authenticateUser, isCustomer, emptyCart);

module.exports = router;
