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

/**
 * #### Login
 *
 * **Functionality:**
 * - This function handles user authentication by verifying the provided email and password.
 * - Upon successful authentication, it issues a JWT token and sets a cookie for user session management.
 *
 * **Input:**
 * - Expects email and password in the request body for authentication.
 *
 * **Checks:**
 * - Validates the presence of required fields (email and password).
 * - Compares the provided password with the hashed password stored in the database.
 *
 * **Token Issuance:**
 * - Creates a JWT token containing user data (email, ID, account type) and sets expiration.
 * - Sets the token as a cookie to maintain user session across requests.
 *
 * **Returns:**
 * - Success status indicating successful login.
 * - User data (excluding password) and the issued token for further authentication.
 *
 * @param {Object} req - The request object containing the user's email and password.
 * @param {Object} res - The response object for sending authentication status and user data.
 * @returns {Object} - Returns a response indicating the success or failure of the login process.
 */
exports.login = async (req, res) => {
  try {
    // Fetch email and password from request body
    const { email, password } = req.body;

    // Check if required fields are not empty
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find the user in the database
    const user = await User.findOne({ email }).populate("additionalDetails");

    // If user is not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);

    // If password is incorrect
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create payload for JWT
    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    // Create and assign a token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    user.password = undefined;

    // Create a cookie for the token
    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to login",
      error: error.message,
    });
  }
};

/**
 * #### Upadate Password
 *
 * **Functionality:**
 * - This function facilitates password change by validating the old password and updating it with a new one.
 * - It retrieves user data from the logged-in user object to ensure the operation is performed securely.
 *
 * **Input:**
 * - Expects old password, new password, and confirmation of the new password in the request body.
 *
 * **Validation:**
 * - Validates the old password against the hashed password stored in the database.
 * - Ensures that the new password matches the confirmed password to prevent mistypes.
 *
 * **Password Update:**
 * - Hashes the new password securely before updating it in the database to maintain confidentiality.
 * - Updates the password in the database associated with the user's ID.
 *
 * **Email Notification:**
 * - Sends an email notification to the user upon successful password change for acknowledgment.
 *
 * **Returns:**
 * - Success status indicating the password change operation was successful.
 *
 * @param {Object} req - The request object containing the old password, new password, and confirmation of the new password.
 * @param {Object} res - The response object for sending the password change status.
 * @returns {Object} - Returns a response indicating the success or failure of the password change process.
 */

exports.changePassword = async (req, res) => {
  try {
    // Get user data for the logged-in user from the database
    const user = await User.findById(req.user.id);

    // Fetch old password, new password, and confirm password from request body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if required fields are not empty
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the old password is correct
    const validPassword = await bcrypt.compare(oldPassword, user.password);

    // If old password is incorrect
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    const updatedData = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true }
    );

    // Send email notification to the user
    try {
      const emailResponse = await mailSender(
        user.email,
        "Password Updated",
        passwordUpdatedEmail(user.email, user.firstName)
      );
      console.info(
        `Email sent to ${user.email} with response: ${emailResponse.response}`
      );
    } catch (error) {
      console.error(
        `Unable to send email to ${user.email} with error: ${error.message}`
      );
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update password",
      error: error.message,
    });
  }
};
