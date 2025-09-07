import { createSlice } from "@reduxjs/toolkit";

const messengerSlice = createSlice({
  name: "messenger",
  initialState: {
    messages: [],
  },
  reducers: {
    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const messengerActions = messengerSlice.actions;
export default messengerSlice;
