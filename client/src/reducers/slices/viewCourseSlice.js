/*
  View Course Slice: This slice manages the state related to viewing course details, including storing section data, entire course data, and tracking completed lectures.

  Initial State:
  - courseSectionData: Array to store course section data.
  - courseEntireData: Array to store entire course data.
  - completedLectures: Array to store completed lectures.
  - totalNumberOfLectures: Total number of lectures.

  Reducers:
  - setCourseSectionData: Sets the course section data.
  - setCourseEntireData: Sets the entire course data.
  - setTotalNumberOfLectures: Sets the total number of lectures.
  - setCompletedLectures: Sets the completed lectures.
  - updateCompletedLectures: Updates the completed lectures.
*/

// Import dependencies
import { createSlice } from "@reduxjs/toolkit";

// Initial state for view course slice
const initialState = {
  // Array to store course section data
  courseSectionData: [],

  // Array to store entire course data
  courseEntireData: [],

  // Array to store completed lectures
  completedLectures: [],

  // Total number of lectures
  totalNumberOfLectures: 0,
};

// Create view course slice
const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    // Set course section data
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload;
    },
    // Set entire course data
    setCourseEntireData: (state, action) => {
      state.courseEntireData = action.payload;
    },
    // Set total number of lectures
    setTotalNumberOfLectures: (state, action) => {
      state.totalNumberOfLectures = action.payload;
    },
    // Set completed lectures
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload;
    },
    // Update completed lectures
    updateCompletedLectures: (state, action) => {
      state.completedLectures = [...state.completedLectures, action.payload];
    },
  },
});

// Export action creators and reducer
export const {
  setCourseEntireData,
  setCourseSectionData,
  setTotalNumberOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
} = viewCourseSlice.actions;
export default viewCourseSlice.reducer;
