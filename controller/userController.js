const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");
const OTP = require("../model/otpModel");
const { sendOTP } = require("../utils/sendOTP");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const extUser = await User.findOne({ email });
    if (extUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const user = await User.create({
      name,
      email,
      avatar: req.file.path,
      password: hashPass,
    });

    const token = generateToken(user._id, res);

    return res.status(201).json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  // console.log(user);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Email and Password not matched" });
  }
  const token = generateToken(user._id, res);
  res.status(201).json({ success: true, token, user });
};

exports.getAll = async (req, res) => {
  const allUser = await User.find();

  res.status(201).json({ success: true, allUser });
};

exports.singleUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  res.status(201).json({ success: true, user });
};

exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: "All filed are required" });
  }

  const id = req.params.id;
  const user = await User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res
    .status(201)
    .json({ message: "User updated successfully", success: true, user });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  res.status(201).json({ message: "User deleted", success: true });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const user = await User.findOne({ email, isAdmin: true }).select("+password");
  // console.log(user);

  if (!user) {
    return res.status(400).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Email and Password not matched" });
  }
  const token = generateToken(user._id, res);
  res.status(201).json({ success: true, token, user });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Email not found" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await OTP.findOneAndUpdate(
    { email },
    { email, otp, expireAt: Date.now() + 10 * 60 * 1000 },
    { upsert: true }
  );
  // console.log(otp);

  await sendOTP({
    email,
    subject: "OTP for password reset",
    text: `OTP ${otp}`,
  });
  res.status(201).json({ message: "OTP send successfully" });
};

exports.verifyOTPAndUpdatePassword = async (req, res) => {
  const { email, otp, password, confirmPassword } = req.body;

  if (!email || !otp || !password || !confirmPassword) {
    return res.status(401).json({ message: "All filds required" });
  }

  const checkOTP = await OTP.findOne({ email });
  if (!checkOTP) {
    return res.status(401).json({ message: "OTP not found" });
  }

  if (checkOTP.otp !== otp) {
    return res.status(401).json({ message: "OTP invalid" });
  }

  if (checkOTP.expireAt < Date.now()) {
    return res.status(401).json({ message: "OTP is expired" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (password !== confirmPassword) {
    return res.status(401).json({ message: "Password dose not match" });
  }

  const hassPass = await bcrypt.hash(password, 10);

  user.password = hassPass;
  await user.save();
  await OTP.deleteOne({ email });

  res.status(201).json({ message: "Password reset successfully" });
};
