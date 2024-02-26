// Import Dependencies
const express = require("express");
const router = express.Router();

// Import Files
const { auth } = require("../middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserData,
  updateProfilePicture,
  getEnrolledCourses,
} = require("../controllers/Profile");

/**
 * #### Profile Routes
 *
 * Functionality:
 *   - These routes handle various operations related to the user's profile, such as updating profile details,
 *     deleting the account, retrieving user details, managing profile picture, and getting enrolled courses.
 *   - All these routes are protected and require the user to be authenticated before accessing them.
 *
 * - Middleware Used:
 *   - auth: Middleware to verify user's credentials.
 *
 * - Endpoints:
 *   - DELETE /deleteProfile: Deletes the user's account.
 *   - PUT /updateProfile: Updates the user's profile details.
 *   - GET /getUserDetails: Retrieves all details of the authenticated user.
 *   - GET /getEnrolledCourses: Retrieves the list of courses the user is enrolled in.
 *   - PUT /updateProfilePicture: Updates the user's profile picture.
 */

router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserData);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateProfilePicture", auth, updateProfilePicture);

module.exports = router;
