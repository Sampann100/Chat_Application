const express = require("express");

const { SignUp, sendOtp, verifyOtp } = require("../controller/authentication/Signup");
const { Login } = require("../controller/authentication/Login");
const { Logout } = require("../controller/authentication/Logout");
const { me, authentication } = require("../middleware/Authentiation");

const authRouter = express.Router();

authRouter.post("/signup", SignUp);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);

authRouter.get("/me", authentication, me);

module.exports = authRouter;
