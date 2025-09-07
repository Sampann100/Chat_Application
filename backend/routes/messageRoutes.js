const express = require("express");
const { sendMessage } = require("../controller/messageController/sendMessage");
const { allMessages } = require("../controller/messageController/allMessage");

const messageRouter = express.Router();

messageRouter.get("/:chatId", allMessages);
messageRouter.post("/", sendMessage);

module.exports = messageRouter;
