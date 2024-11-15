import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  role: "",
  userId: "",
  user: false,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userId = action.payload.id;
      state.user = true;
    },
    clearToken: (state) => {
      state.token = "";
      state.role = "";
      state.userId = "";
      state.user = false;
    },
    setRole: (state, action) => {
      state.role = action.payload.role;
    },
  },
});

export const { setToken, clearToken, setRole } = tokenSlice.actions;
export default tokenSlice.reducer;
