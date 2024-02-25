// Import dependencies
require("dotenv").config(); // Load environment variables

// Import files
const User = require("../models/User");
const Profile = require("../models/Profile");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const Course = require("../models/Course");

/**
 * #### Update Profile Details
 *
 * **Functionality:**
 * - This function updates the user's profile details in the database.
 *
 * **Expects:**
 * - Expects gender, date of birth, about, and contact information in the request body.
 *
 * **Checks:**
 * - Validates if all required fields are present.
 *
 * **Retrieves:**
 * - Retrieves the user details from the database.
 *
 * **Updates:**
 * - Updates the profile data with the new details.
 *
 * **Returns:**
 * - Success status and the updated profile data.
 *
 * @param {Object} req - The request object containing the user's profile details.
 * @param {Object} res - The response object to send the success status and updated profile data.
 * @returns {Object} - Returns a response containing the success status and updated profile data.
 */
exports.updateProfile = async (req, res) => {
  try {
    // Fetch data from request body
    const { gender, dateOfBirth = "", about = "", contact } = req.body;

    // Get user id from request
    const userId = req.user.id;

    // Check if all required fields are present
    if (!gender || !contact || !dateOfBirth || !about || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Fetch user details from database
    const userData = await User.findById(userId);
    const profileID = userData.additionalDetails;
    const profileDetails = await Profile.findById(profileID);

    // Update profile data with new details
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contact = contact;
    profileDetails.gender = gender;

    // Save updated profile data
    await profileDetails.save();

    // Return success status and updated profile data
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (error) {
    // Return error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
      error: error.message,
    });
  }
};

/**
 * #### Get All Profile Details
 *
 * **Functionality:**
 * - This function retrieves all details for the logged-in user from the database.
 *
 * **Retrieves:**
 * - Retrieves user details and associated additional details from the database.
 *
 * **Returns:**
 * - Success status and the user data.
 *
 * @param {Object} req - The request object containing the user's ID.
 * @param {Object} res - The response object to send the success status and user data.
 * @returns {Object} - Returns a response containing the success status and user data.
 */
exports.getAllUserData = async (req, res) => {
  try {
    // Get user id from request
    const userId = req.user.id;

    // Fetch user details from database
    const userData = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    // Return success status and user data
    return res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: userData,
    });
  } catch (error) {
    // Return error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user details",
      error: error.message,
    });
  }
};

/**
 * #### Delete Account
 *
 * **Functionality:**
 * - This function deletes the user account, associated profile, and unenrolls the user from all courses.
 *
 * **Deletes:**
 * - Profile associated with the user.
 * - Unenrolls the user from all courses.
 * - User account from the database.
 *
 * **Returns:**
 * - Success status.
 *
 * @param {Object} req - The request object containing the user's ID.
 * @param {Object} res - The response object to send the success status.
 * @returns {Object} - Returns a response containing the success status.
 */
exports.deleteAccount = async (req, res) => {
  try {
    // Get user id from request
    const userId = req.user.id;

    // Fetch user details from database
    const user = await User.findById({ userId });

    // Check if user exists in the database
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete profile from the database
    await Profile.findByIdAndDelete(user.additionalDetails);

    // Unenroll user from all courses
    await Course.findByIdAndUpdate(
      { _id: user.courses },
      { $pullAll: { courses: user.courses } }, // May give error
      { new: true }
    );

    // Delete user from the database
    await User.findByIdAndDelete(userId);

    // Return success status
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    // Return error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete account",
      error: error.message,
    });
  }
};
