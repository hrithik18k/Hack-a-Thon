import { createSlice } from "@reduxjs/toolkit";

import jwtDecode from "jwt-decode";

const getInitialUserInfo = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token ? jwtDecode(token) : null;
};

export const rootReducer = createSlice({
  name: "root",
  initialState: {
    loading: true,
    userInfo: getInitialUserInfo(),
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setLoading, setUserInfo } = rootReducer.actions;
export default rootReducer.reducer;
