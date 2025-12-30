const express = require("express");

const upload = require("../middleware/cloud");
const { isAuth } = require("../middleware/isAuth");
const {
  createProducts,
  updateProducts,
  getAllProduct,
  getOneProduct,
} = require("../controller/productController");

const router = express.Router();

router.post("/add", createProducts);
router.put("/update/:id", updateProducts);
router.get("/all", getAllProduct);
router.get("/:id", getOneProduct);

module.exports = router;
