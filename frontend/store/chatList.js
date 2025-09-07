import { createSlice } from "@reduxjs/toolkit";

const chatListSlice = createSlice({
  name: "chatList",
  initialState: [],
  reducers: {
    setChatList: (state, action) => {
      return action.payload;
    },
  },
});

export const chatListActions = chatListSlice.actions;
export default chatListSlice;
