const userModel = require("../../models/userModel");
const session = require("express-session");
const bcrypt = require("bcrypt");

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, message: "Email or password is incorrect." });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not logged" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Password is incorrect" });
    }

    req.session.userInfo = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      email: user.email,
      pic: user.pic,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false, message: "Error login in." });
  }
};
