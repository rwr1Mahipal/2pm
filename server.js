const express = require("express");
const { connectDB } = require("./db/db.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is working om 5000");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});
