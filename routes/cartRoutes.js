const express = require("express");

const upload = require("../middleware/cloud");
const { isAuth } = require("../middleware/isAuth");
const {
  addToCart,
  removeItemFromCart,
  getCart,
} = require("../controller/CartController");

const router = express.Router();

router.post("/add", isAuth, addToCart);
router.delete("/delete/:id", isAuth, removeItemFromCart);
router.get("/", isAuth, getCart);

module.exports = router;
