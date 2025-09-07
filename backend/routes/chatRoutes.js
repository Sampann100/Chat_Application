const express = require("express");
const { accessChat } = require("../controller/chatController.js/accessChat");
const { fetchChats } = require("../controller/chatController.js/fetchChats");
const { createGroupChat } = require("../controller/chatController.js/createGroupChat");
const { renameGroupChat } = require("../controller/chatController.js/renameGroupChat");
const chatRouter = express.Router();

chatRouter.post("/", accessChat);
chatRouter.get("/", fetchChats);
chatRouter.post("/create-group", createGroupChat);
chatRouter.put("/rename", renameGroupChat);
// chatRouter.put("/groupremove", removeFromGroup);
// chatRouter.put("/groupadd", addToGroup);

module.exports = chatRouter;
