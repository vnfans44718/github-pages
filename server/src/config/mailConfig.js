const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
module.exports = transporter;
