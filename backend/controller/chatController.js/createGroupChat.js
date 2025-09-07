const chatModel = require("../../models/chatModel");
const userModel = require("../../models/userModel");

exports.createGroupChat = async (req, res, next) => {
  try {
    const { groupName, selectedUsers } = req.body;
    const userInfoId = req.session.userInfo.id;

    if (!groupName || !selectedUsers || !Array.isArray(selectedUsers)) {
      return res
        .status(400)
        .json({ message: "Please provide groupName and selectedUsers array." });
    }

    const userInfo = await userModel.findById(userInfoId).select("-password");

    // Extract IDs from selectedUsers
    let members = selectedUsers.map((u) => u._id.toString());

    // Ensure current user is in the group
    if (!members.includes(userInfo._id.toString())) {
      members.push(userInfo._id);
    }

    // Require at least 3 users for a group (including current user)
    if (members.length < 3) {
      return res.status(400).json({
        message: "At least 3 users are required to form a group chat.",
      });
    }

    // Create group
    const groupChat = await chatModel.create({
      chatName: groupName,
      isGroupChat: true,
      users: members,
      groupAdmin: userInfoId,
    });

    // Populate for frontend
    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(fullGroupChat);
  } catch (err) {
    console.error("CreateGroupChat error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
