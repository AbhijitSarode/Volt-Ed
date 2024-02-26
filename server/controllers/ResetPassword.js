// Import Dependencies
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Import Files
const User = require("../models/User");
const mailSender = require("../utils/mailSender"); // Import mailSender to send mail using nodeMailer service
const { resetPasswordMail } = require("../mails/resetPasswordEmail"); // Import successful password reset email template
const { passwordUpdatedEmail } = require("../mails/passwordUpdatedEmail"); // Import successful password update email template

/**
 * #### Reset Password Token
 *
 * Functionality: Sends a reset password email to the user with a unique link.
 *
 * - Expects: User's name and email in req body.
 * - Checks: if the user with the provided email exists.
 * - Generates: a unique random token and adds it to the user's details in the database with expiry time.
 * - Sends: an email with a link containing the token to reset the password.
 * - Returns: success status, a message, and the reset link.
 *
 * @param {Object} req - The request object containing user's name and email.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status, message, and reset link.
 */
exports.resetPasswordToken = async (req, res) => {
  try {
    // Fetch user details from the request
    const { name, email } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Generate a unique random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Add the token and expiry time to the user's details in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 300000; // 5 minutes

    // Save the updated user details
    await user.save();

    // Generate unique link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send the reset password email
    mailSender({
      to: user.email,
      subject: "Reset Password Link from Volt-Ed",
      html: resetPasswordMail(resetLink, name),
    });

    // Send the success status and data
    return res.status(200).json({
      success: true,
      message: "Reset password link sent successfully.",
      resetLink,
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to send reset password link.",
      error: error.message,
    });
  }
};
