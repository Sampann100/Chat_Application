const express = require("express");
const { allUsers } = require("../controller/userController.js/getAllUsers");
const userRouter = express.Router();

userRouter.get("/", allUsers);

module.exports = userRouter;
