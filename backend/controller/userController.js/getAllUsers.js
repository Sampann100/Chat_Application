const userModel = require("../../models/userModel");

exports.allUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
