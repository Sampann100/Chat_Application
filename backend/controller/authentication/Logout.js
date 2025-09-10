const session = require("express-session");

exports.Logout = async (req, res, next) => {
  try {
    if (req.session && req.session.userInfo) {
      req.session.destroy((err) => {
        if (err) {
          console.log("Session destroy error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to logout" });
        }

        res.clearCookie("connect.sid", { path: "/" });
        return res
          .status(200)
          .json({ success: true, message: "User is Logged out" });
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "No active session found" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};
