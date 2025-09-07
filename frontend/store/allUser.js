import { createSlice } from "@reduxjs/toolkit";

const allUserSlice = createSlice({
  name: "allUser",
  initialState: [],
  reducers: {
    setAllUsers: (state, action) => {
      return action.payload;
    },
  },
});

export const allUserActions = allUserSlice.actions;
export default allUserSlice;
