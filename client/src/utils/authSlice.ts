import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    isLoading: true, 
    user: {
      email: "",
      roles: [],
    },
  },
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {
        email: "",
        roles: [],
      };
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
