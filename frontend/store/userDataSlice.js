import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  success: false,
  loading: true,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      console.log(action.payload);
      state.user = action.payload.userInfo;
      state.success = action.payload.success;
      state.loading = false;
    },
    removeUserData: (state) => {
      state.user = null;
      state.success = false;
      state.loading = false;
    },
    startLoading: (state) => {
      state.loading = true;
    },
  },
});

export const userDataActions = userDataSlice.actions;
export default userDataSlice;
