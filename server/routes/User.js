// Import dependencies
const express = require("express");
const router = express.Router();

// Import middleware
const { auth } = require("../middlewares/auth");

// Import required controllers
const {
  login,
  signup,
  sendOTP,
  changePassword,
  logout,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  updatePassword,
} = require("../controllers/ResetPassword");

/**
 * #### Authentication Routes
 *
 * Functionality:
 *   - These routes handle user authentication, including login, signup, OTP verification,
 *     password change, logout, and password reset.
 *  -  These routes are public and do not require the user to be authenticated before accessing them.
 *
 * - Middleware Used:
 *   - auth: Middleware to verify user's credentials.
 *
 * - Endpoints:
 *   - POST /login: Authenticates the user. [Public]
 *   - POST /signup: Registers a new user. [Public]
 *   - POST /sendOTP: Sends a one-time password for authentication. [Public]
 *   - PUT /logout: Logs the user out. [Protected]
 *   - POST /changepassword: Changes the user's password. [Protected]
 *   - POST /reset-password-token: Generates a token for resetting the password. [Public]
 *   - POST /reset-password: Resets the user's password using the provided token. [Public]
 */

// Public Routes
router.post("/login", login);
router.post("/signup", signup);
router.post("/sendOTP", sendOTP);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", updatePassword);

// Protected Routes
router.put("/logout", auth, logout);
router.post("/change-password", auth, changePassword);

module.exports = router;
