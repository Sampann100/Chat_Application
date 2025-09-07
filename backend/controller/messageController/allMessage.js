const { default: mongoose } = require("mongoose");
const messageModel = require("../../models/messageModel");

exports.allMessages = async (req, res, next) => {
  const { chatId } = req.params;
  // console.log(chatId);

  if (!chatId) {
    next({ status: 404, message: "No chat found" });
  }

  try {
    const messages = await messageModel
      .find({ chat: new mongoose.Types.ObjectId(chatId) })
      .populate("sender", "username _id email pic")
      .populate("chat");

    // console.log(messages);
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
  }
};
