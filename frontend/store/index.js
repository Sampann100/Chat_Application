import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./userDataSlice";
import chatListSlice from "./chatList";
import allUserSlice from "./allUser";
import messengerSlice from "./messager";

const chat_app_store = configureStore({
  reducer: {
    userData: userDataSlice.reducer,
    chatList: chatListSlice.reducer,
    allUser: allUserSlice.reducer,
    messenger: messengerSlice.reducer,
  },
});

export default chat_app_store;
