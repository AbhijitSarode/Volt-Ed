/*
  Description:
  This file contains controller functions for managing user-related operations in the application. These functions
  handle operations such as updating user profile details, retrieving user data, deleting user accounts, fetching
  enrolled courses, and updating profile pictures. These functions interact with the User and Profile models.

  Controller Functions:
  1. updateProfile: Updates user profile details in the database.
  2. getAllUserData: Retrieves all details for the logged-in user.
  3. deleteAccount: Deletes the user account, associated profile, and unenrolls from all courses.
  4. getEnrolledCourses: Retrieves all courses enrolled by the user.
  5. updateProfilePicture: Updates the user's profile picture.

  Dependencies:
  - User model: Model representing user data.
  - Profile model: Model representing additional profile details of users.
  - Course model: Model representing course data.
  - uploadFileToCloudinary: Utility function for uploading files to Cloudinary.
*/
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

/**
 * #### Retrieve All Enrolled Courses
 *
 * **Functionality:**
 * - This function retrieves all courses enrolled by the user from the database.
 *
 * **Returns:**
 * - Success status and the enrolled courses data.
 *
 * @param {Object} req - The request object containing the user's ID.
 * @param {Object} res - The response object to send the enrolled courses data.
 * @returns {Object} - Returns a response containing the success status and the enrolled courses data.
 */
exports.getEnrolledCourses = async (req, res) => {
  try {
    // Get user id from request
    const userId = req.user.id;

    // Fetch user details from database
    const userData = await User.findOne({ _id: userId })
      .populate("courses")
      .exec();

    // If user is not enrolled in any courses
    if (!userData.courses) {
      return res.status(404).json({
        success: false,
        message: "User is not enrolled in any courses",
      });
    }

    // Return success status and enrolled courses data
    return res.status(200).json({
      success: true,
      message: "Enrolled courses retrieved successfully",
      data: userData.courses,
    });
  } catch (error) {
    // Return error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve enrolled courses",
      error: error.message,
    });
  }
};

/**
 * #### Update Profile Picture
 *
 * **Functionality:**
 * - This function expects a displayPicture file in the request files.
 * - It uploads the displayPicture to Cloudinary and updates the user's profile picture URL in the database.
 *
 * **Returns:**
 * - Success status and the updated profile picture data.
 *
 * @param {Object} req - The request object containing the displayPicture file and user's ID.
 * @param {Object} res - The response object to send the updated profile picture data.
 * @returns {Object} - Returns a response containing the success status and the updated profile picture data.
 */
exports.updateProfilePicture = async (req, res) => {
  try {
    // Get user id from request
    const userId = req.user.id;

    // Get displayPicture file from request
    const displayPicture = req.files.displayPicture;

    // Check if displayPicture file is present
    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "Display picture is required",
      });
    }

    // Upload displayPicture to Cloudinary
    const displayPictureURL = await uploadFileToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    console.info(
      `Display picture is ${displayPictureURL} & uploaded to Cloudinary at ${displayPictureURL.secure_url}`
    );

    // Update user's profile picture URL in the database
    const updateProfilePicture = await User.findByIdAndUpdate(
      userId,
      { image: displayPictureURL.secure_url }, // May give error
      { new: true }
    );

    // Return success status and updated profile picture data
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: { updateProfilePicture, displayPictureURL },
    });
  } catch (error) {
    // Return error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile picture",
      error: error.message,
    });
  }
};
