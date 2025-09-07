require("dotenv").config();
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const express = require("express");
const authRouter = require("./routes/auth");
const { authentication } = require("./middleware/Authentiation");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");

const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const messageModel = require("./models/messageModel");
const chatModel = require("./models/chatModel");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const sessionMiddleWare = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
});

app.use(sessionMiddleWare);

app.use("/api/auth", authRouter);
app.use(authentication);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//create HTTP Server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use((socket, next) => {
  sessionMiddleWare(socket.request, {}, next);
});

io.on("connect", (socket) => {
  console.log("New user connected!", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send-message", async (data) => {
    const { senderMessage, selectedChatRoom } = data;
    const userInfoId = socket.request.session.userInfo.id;
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

    io.to(selectedChatRoom).emit("receive-message", { message });
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
