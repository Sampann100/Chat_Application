exports.authentication = async (req, res, next) => {
  try {
    const userInfo = req.session.userInfo;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated." });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.me = (req, res, next) => {
  try {
    if (!req.session.userInfo) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated." });
    }
    res.status(200).json({ success: true, userInfo: req.session.userInfo });
  } catch (err) {
    console.log(err);
  }
};
