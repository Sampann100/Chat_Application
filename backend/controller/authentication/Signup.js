const { transporter } = require("../../middleware/transporter");
const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const otpModel = require("../../models/otpModel");

exports.sendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Email is required!" });
    }
    const otp = String(Math.floor(Math.random() * (99999 - 10000) + 10000));
    let user = await otpModel.findOne({ email });
    if (!user) {
      user = await otpModel.create({
        email,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
      });
    } else {
      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
      await user.save();
    }

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your OTP for email verification!!",
      html: `<h2>Your OTP is: <b>${otp}</b></h2><p>It will expire in 5 minutes.</p>`,
    });

    res.status(201).json({ message: "OTP sent to email" });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ success: false, message: "Error sending OTP" });
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const otpDoc = await otpModel.findOne({ email });
    if (!otpDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    if (otpDoc.otp !== otp || otpDoc.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid → delete the OTP document
    await otpModel.deleteOne({ email });

    res.status(201).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

exports.SignUp = async (req, res, next) => {
  const { username, email, password, pic } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const alreadyExist = await userModel.findOne({ email });
    if (alreadyExist) {
      return res.status(201).json({
        success: true,
        message: "User already exists. Please log in.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new userModel({
      username,
      email,
      password: hashPassword,
      pic,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "Signup successful! Please log in." });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ success: false, message: "Error signing up" });
  }
};
