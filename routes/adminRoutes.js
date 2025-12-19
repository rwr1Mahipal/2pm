const express = require("express");
const { adminLogin, singleUser, getAll } = require("../controller/userController");
const { isAdmin } = require("../middleware/isAdmin");
const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/:id", isAuth, isAdmin, singleUser);
router.get("/getall", isAuth, isAdmin, getAll);


module.exports = router;
