/*
  Root Reducer: Combines individual reducers to create a single reducer for the entire application state.

  Dependencies:
  - combineReducers: Function from Redux to combine multiple reducers into a single reducer.

  Description:
  - Imports individual reducers from their respective files.
  - Combines the reducers using combineReducers function.
  - Each reducer is assigned to a key in the root state object.
*/

// Import dependencies
import { combineReducers } from "@reduxjs/toolkit";

// Import individual reducers
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import cartReducer from "./slices/cartSlice";
import courseReducer from "./slices/courseSlice";
import viewCourseReducer from "./slices/viewCourseSlice";

// Combine reducers to create root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  course: courseReducer,
  profile: profileReducer,
  viewCourse: viewCourseReducer,
});

// Export root reducer
export default rootReducer;
