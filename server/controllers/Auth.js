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

/**
 * #### User Registration and OTP Verification
 * **Functionality:**
 * - Handles user registration and OTP verification.
 *
 * **Input:**
 * - Expects user details and OTP in the request body.
 *
 * **Validation:**
 * - Checks mandatory fields presence, password correctness and OTP uniqueness.
 *
 * **Password Handling:**
 * - Encrypts the password before storage.
 *
 * **User Data Storage:**
 * - Saves user, profile data and generates a profile image.
 *
 * **Output:**
 * - Returns success status and user data upon successful registration.
 *
 * **Error Handling:**
 * - Manages server issues, existing user detection, invalid OTP, and password mismatch scenarios.
 *
 * @param {Object} req - The request object containing user details and OTP.
 * @param {Object} res - The response object for sending registration status and user data.
 * @returns {Object} - Returns a response indicating the success or failure of the registration process.
 */
exports.signup = async (req, res) => {
  try {
    // Fetch data from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // Check if required fields are not empty
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user is already registered
    const userPresent = await User.findOne({ email });

    // If user is already registered, let client know
    if (userPresent) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // Find the recent OTP in the database
    const otpPresent = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.info(`Recent OTP is: ${otpPresent}`);

    // Validate the OTP
    if (otpPresent.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    } else if (otpPresent[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create entry in the Profile collection
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contact: null,
    });

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // Send welcome email to the user
    mailSender(email, "Welcome to the platform", "Welcome to the platform");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, profileDetails },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to register user",
      error: error.message,
    });
  }
};
