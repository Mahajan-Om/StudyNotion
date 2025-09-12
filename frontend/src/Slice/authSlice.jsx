import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {

    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },

    setToken(state, value) {
      state.token = value.payload;   //setToken is a reducer function ,value is the action object passed by Redux value.payload is the data that was passed when dispatching the action
    },
  },
});

export const { setToken , setLoading , setSignupData } = authSlice.actions;

export default authSlice.reducer;