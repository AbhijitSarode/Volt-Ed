// Import dependencies
const OTPGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import files
const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
const { passwordUpdatedEmail } = require("../mails/passwordUpdatedEmail");

/**
 * #### OTP Generation and Delivery
 *
 * **Functionality:**
 * - This function handles the process of generating and sending a unique One-Time Password (OTP) to the email address provided for user registration.
 * - It first checks if the user is already registered to prevent duplicate OTP generation.
 * - Then, it generates a random OTP using OTPGenerator library with specific configurations for complexity.
 * - Ensures the uniqueness of the generated OTP to maintain security and prevent interception.
 * - The OTP is then sent via email and stored in the database for verification purposes.
 *
 * **Input:**
 * - Expects an email address in the request body for OTP delivery.
 *
 * **Checks:**
 * - Verifies if the user is already registered to prevent duplicate OTP generation.
 * - Ensures the uniqueness of the generated OTP to avoid conflicts.
 *
 * **Uses:**
 * - Utilizes the OTPGenerator library to create a secure and random OTP of 6 characters.
 * - Saves the generated OTP along with the associated email address into the database.
 *
 * @param {Object} req - The request object containing the user's email address for OTP delivery.
 * @param {Object} res - The response object for sending the OTP delivery status and the generated OTP.
 * @returns {Object} - Returns a response indicating the success or failure of the OTP delivery process.
 */

exports.sendOTP = async (req, res) => {
  try {
    // Fetch email from request body
    const { email } = req.body;

    // Find user in DB with the provided email
    const userPresent = await User.findOne({ email });

    // If user is already registered, let client know
    if (userPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // Generate an OTP
    var otp = OTPGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Check if the generated OTP is unique
    const result = await OTP.findOne({ otp });

    // If the OTP is not unique, generate a new one
    while (result) {
      var otp = OTPGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // Check if the new OTP is unique
      result = await OTP.findOne({ otp });
    }

    // Create a payload with email and OTP
    const payload = { email, otp };

    // Send OPT mail and add it to the OTP collection in the database
    const OTPBody = await OTP.create(payload);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: { payload, OTPBody },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to send OTP",
      error: error.message,
    });
  }
};
