const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const dotenv = require("dotenv");
dotenv.config();

exports.isAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "User is not authication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(501).json({ message: "Error while authentication" });
  }
};
