import { createSlice } from "@reduxjs/toolkit";

// const savedUser = localStorage.getItem("userData")
//   ? JSON.parse(localStorage.getItem("userData"))
//   : null;

const userDataSlice = createSlice({
  name: "userData",
  initialState: { user: null, success: false },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.userInfo;
      state.success = action.payload.success;
      // localStorage.setItem("userData", JSON.stringify(action.payload.userInfo));
    },

    removeUserData: (state, action) => {
      state.user = null;
      state.success = false;
      // localStorage.removeItem("userData");
    },
  },
});

export const userDataActions = userDataSlice.actions;
export default userDataSlice;
