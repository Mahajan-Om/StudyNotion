import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  loading:false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {

    setUser(state, value) {
      state.user = value.payload;   //setToken is a reducer function ,value is the action object passed by Redux value.payload is the data that was passed when dispatching the action
    },
    setLoading(state, value) {
      state.loading = value.payload
    },

  },
});

export const { setUser , setLoading } = profileSlice.actions;

export default profileSlice.reducer;