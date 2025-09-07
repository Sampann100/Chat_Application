const chatModel = require("../../models/chatModel");

exports.fetchChats = async (req, res, next) => {
  try {
    const userId = req.session.userInfo.id;

    const chats = await chatModel
      .find({ users: userId })
      .populate("users", "-password");

    const result = chats.map((chat) => {
      let usersList = [];

      if (!chat.isGroupChat) {
        usersList = chat.users.filter((u) => u._id.toString() !== userId);
      } else {
        usersList = chat.users;
      }

      return {
        ...chat.toObject(),
        users: usersList,
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
