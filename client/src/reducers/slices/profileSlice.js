/*
  Profile Slice: This slice manages the state related to user profiles, including storing user data and managing loading state.

  Initial State:
  - user: User data.
  - loading: Loading state.

  Reducers:
  - setUser: Sets the user data.
  - setLoading: Sets the loading state.
*/

// Import dependencies
import { createSlice } from "@reduxjs/toolkit";

// Initial state for profile slice
const initialState = {
  // User data
  user: null,
  // Loading state
  loading: false,
};

// Create profile slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Set user data
    setUser(state, action) {
      state.user = action.payload;
    },
    // Set loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

// Export action creators and reducer
export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
