const Cart = require("../models/Cart");

exports.addProductToCard = async (req, res) => {
  try {
    const { productId } = req.body;
    const { id: customerId } = req.user;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      // if (cart?.customer?.toString() !== customerId) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }

      const newCart = new Cart({
        customer: customerId,
        products: [
          {
            product: productId,
            quantity: 1,
          },
        ],
      });
      await newCart.save();
      return res
        .status(200)
        .json({ success: true, message: "Product added to cart successfully" });
    } else {
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }
      await cart.save();
      return res
        .status(200)
        .json({ success: true, message: "Product added to cart successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.removeProductFromCard = async (req, res) => {
  try {
    const { productId } = req.body;
    const { id: customerId } = req.user;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    } else {
      if (cart.customer.toString() !== customerId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );

      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
        } else {
          cart.products.splice(productIndex, 1);
        }

        await cart.save();
        return res
          .status(200)
          .json({ success: true, message: "Product removed from cart successfully" });
      } else {
        return res.status(404).json({ success: false, message: "Product not found in cart" });
      }
    }
  } catch (error) {
    console.log("error while removing item from cart : ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { id: customerId } = req.user;

    const cart = await Cart.findOne({ customer: customerId }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    if (cart.customer.toString() !== customerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({ success: true, message: "Cart fetched successfully", cart });
  } catch (error) {
    console.log("error while getting cart : ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const { id: customerId } = req.user;

    const cart = await Cart.findOne({ customer: customerId });

    if (cart.customer.toString() !== customerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is already empty" });
    }

    cart.products = [];
    await cart.save();

    return res.status(200).json({ success: true, message: "Cart emptied successfully" });
  } catch (error) {
    console.log("error while emptying cart : ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
