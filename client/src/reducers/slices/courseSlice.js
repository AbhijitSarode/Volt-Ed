/*
  Course Slice: This slice manages the state related to creating or editing courses, including setting the current step,
  storing course data, managing edit mode, and resetting the state.

  Initial State:
  - step: Current step in the course creation process.
  - course: Data of the course being created or edited.
  - editCourse: Flag indicating whether the course is being edited.

  Reducers:
  - setStep: Sets the current step in the course creation process.
  - setCourse: Sets the data of the course being created or edited.
  - setEditCourse: Sets the edit mode for the course.
  - resetCourseState: Resets the course slice state to its initial values.
*/

// Import dependencies
import { createSlice } from "@reduxjs/toolkit";

// Initial state for course slice
const initialState = {
  // Current step in course creation process
  step: 1,
  // Data of the course being created or edited
  course: null,
  // Flag indicating whether the course is being edited
  editCourse: false,
};

// Create course slice
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Set current step in course creation process
    setStep(state, action) {
      state.step = action.payload;
    },
    // Set course data
    setCourse(state, action) {
      state.course = action.payload;
    },
    // Set edit mode for course
    setEditCourse(state, action) {
      state.editCourse = action.payload;
    },
    // Reset course slice state to initial values
    resetCourseState(state) {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
    },
  },
});

// Export action creators and reducer
export const { setStep, setCourse, setEditCourse, resetCourseState } =
  courseSlice.actions;
export default courseSlice.reducer;
