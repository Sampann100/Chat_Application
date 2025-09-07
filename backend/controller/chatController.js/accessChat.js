const chatModel = require("../../models/chatModel");
const userModel = require("../../models/userModel");

exports.accessChat = async (req, res, next) => {
  const sessionUserId = req.session.userInfo.id;
  const { otherUserId } = req.body;
  console.log(otherUserId)

  if (!otherUserId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const otherUserData = await userModel.findById(otherUserId);
    const sessionUserData = await userModel.findById(sessionUserId);

    if (!otherUserData || !sessionUserData) {
      return res.status(404).json({ message: "User not found" });
    }

    let chat = await chatModel
      .findOne({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: sessionUserId } } },
          { users: { $elemMatch: { $eq: otherUserId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage.sender", "_id name email");

    if (!chat) {
      const createChat = await chatModel.create({
        chatName: otherUserData.username,
        isGroupChat: false,
        users: [sessionUserId, otherUserId],
      });

      chat = await chatModel
        .findById(createChat._id)
        .populate("users", "-password")
        .populate("latestMessage.sender", "_id name email");
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
