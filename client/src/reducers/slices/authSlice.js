/*
  Description:
  This file defines the authentication slice for the Redux store. It contains the initial state, action
  creators, and reducer for managing authentication-related state in the application. 
  This slice manages the authentication state including signup data, loading status, and authentication token.

  Dependencies:
  - createSlice: Function from '@reduxjs/toolkit' for creating Redux slice.
  
  Reducers:
  - setSignupData: Updates the signupData field in the authentication state with the provided payload.
  - setLoadingData: Updates the loading field in the authentication state with the provided payload.
  - setToken: Updates the token field in the authentication state with the provided payload.
  - setLoading: Updates the loading field in the authentication state with the provided payload.
*/

// Import dependencies
import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication slice
const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set signup data
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    // Set loading data
    setLoadingData(state, action) {
      state.loading = action.payload;
    },
    // Set token
    setToken(state, action) {
      state.token = action.payload;
    },
    // Set loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

// Export action creators and reducer
export const { setSignupData, setLoadingData, setToken, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
