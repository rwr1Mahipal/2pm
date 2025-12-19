const express = require("express");
const {
  register,
  getAll,
  singleUser,
  deleteUser,
  updateUser,
  login,
  forgotPassword,
  verifyOTPandResetPassword,
  verifyOTPAndUpdatePassword,
} = require("../controller/userController");
const upload = require("../middleware/cloud");
const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/:id", isAuth, singleUser);
router.put("/update/:id", isAuth, updateUser);
router.delete("/delete/:id", isAuth, deleteUser);
router.post("/sendOTP", isAuth, forgotPassword);
router.post("/verifyOTP", isAuth, verifyOTPAndUpdatePassword);

module.exports = router;
