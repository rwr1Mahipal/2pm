const express = require("express");
const { order, verifyPayment } = require("../controller/order");
const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post("/create-order",isAuth, order);
router.post("/verify-payment",isAuth, verifyPayment);

module.exports = router;
