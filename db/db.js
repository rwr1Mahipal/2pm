const mongoose = require("mongoose");

exports.connectDB = () => {
  try {
    mongoose
      .connect("mongodb://localhost:27017/2pm")
      .then(() => console.log("DB is connected"))
      .catch(() => console.log("Error while connecting DB"));
  } catch (error) {
    console.error("DB Connection Err: ", error);
  }
};
