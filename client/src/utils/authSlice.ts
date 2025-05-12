import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: {
      email: "",
      roles: [],
    },
  },
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        email: "",
        roles: [],
      };
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
