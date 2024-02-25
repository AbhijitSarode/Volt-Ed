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
