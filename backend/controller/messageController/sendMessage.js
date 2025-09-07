const messageModel = require("../../models/messageModel");
const chatModel = require("../../models/chatModel");

exports.sendMessage = async (req, res, next) => {
  const { senderMessage, selectedChatRoom } = req.body;
  const userInfoId = req.session.userInfo.id;

  if (!senderMessage || !selectedChatRoom) {
    return res
      .status(400)
      .json({ message: "Invalid data passed into request" });
  }

  try {
    let message = await messageModel.create({
      sender: userInfoId,
      content: senderMessage,
      chat: selectedChatRoom,
    });

    message = await message.populate("sender", "username email pic");
    message = await message.populate("chat");
    message = await chatModel.populate(message, {
      path: "chat.users",
      select: "username email pic",
    });

    return res.status(200).json(message);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
