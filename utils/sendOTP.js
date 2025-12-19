const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

exports.sendOTP = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OTP_USER,
      pass: process.env.OTP_PASS,
    },
  });

  const mail = {
    from: process.env.OTP_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mail);
};
