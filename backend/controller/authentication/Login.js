const userModel = require("../../models/userModel");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { transporter } = require("../../middleware/transporter");

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, message: "Email or password is incorrect." });
    }

    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not logged" });

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

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our Messenger App!",
      html: `
    <div style="font-family: 'Arial', sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #007bff;">Welcome, ${user.username}! 👋</h2>
      <p>We're thrilled to have you join our community. Get ready to connect, chat, and share like never before!</p>
      <p>Our app offers:</p>
      <ul style="list-style: disc; margin-left: 20px;">
        <li><strong>Fast & Secure Messaging:</strong> Your conversations are protected.</li>
        <li><strong>Seamless Sharing:</strong> Easily send files, photos, and more.</li>
        <li><strong>Connect Anytime, Anywhere:</strong> Stay in touch with friends and family globally.</li>
      </ul>
      <p>Ready to start chatting? Click the button below to dive in!</p>
      <p style="margin-top: 20px;">
        <a href=${process.env.FRONTEND_URL} style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Start Chatting Now
        </a>
      </p>
      <p style="margin-top: 30px;">
        Best,<br>
        The Messenger App Team
      </p>
    </div>
  `,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false, message: "Error login in." });
  }
};
