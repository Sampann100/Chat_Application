const chatModel = require("../../models/chatModel");

exports.renameGroupChat = async (req, res, next) => {
    const userId = req.session.userInfo._id;
    const { chatId, chatName } = req.body;

    try {
        const updateChat = await chatModel.findByIdAndUpdate(chatId, {
            chatName: chatName
        }, { new: true })
            .populate("user", "-passowrd")
            .populate("groudAdmin", "-password");

        if (!updateChat) {
            res.status(404)
        }
        else {
            res.status(200).json(updateChat);
        }
    }
    catch (err) {
        console.log(err);
    }
}