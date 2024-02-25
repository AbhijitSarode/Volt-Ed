/*
  Description:
  This file configures the Redux store using the '@reduxjs/toolkit' package. It imports the root reducer
  from the 'index.js' file and uses it to configure the store. The configured store is then exported for
  use in the application.

  Dependencies:
  - '@reduxjs/toolkit': Package for configuring Redux store.
  - rootReducer: Root reducer of the application.

  Note: This file is responsible for setting up the Redux store.
*/

import { configureStore } from "@reduxjs/toolkit";

// Import the root reducer
import rootReducer from "./index";

// Configure Redux store
const store = configureStore({
  reducer: rootReducer,
});

// Export the Redux store
export default store;
