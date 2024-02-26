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

/**
 * #### Update Password
 *
 * Functionality: Updates the user's password after verifying the reset token.
 *
 * - Expects: New password, confirm password, and reset token in req body.
 * - Checks: if passwords match, if the token is valid, and if the token has expired.
 * - Hashes: the new password.
 * - Updates: the user's password in the database.
 * - Sends: a confirmation email about the password update.
 * - Returns: success status, a message, and hashed password data.
 *
 * @param {Object} req - The request object containing the new password, confirm password, and reset token.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status, message, and hashed password data.
 */
exports.updatePassword = async (req, res) => {
  try {
    // Fetch data from the request
    const { newPassword, confirmPassword, token } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Find the user with the reset token
    const user = await User.findOne({ token });
    const { email, firstName } = user;

    // Check if token exsists in the database
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // Check if the token has expired
    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    user.token = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send the confirmation email
    mailSender({
      to: email,
      subject: "Password Updated Successfully",
      html: passwordUpdatedEmail(firstName),
    });

    // Send the success status and data
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
      data: { hashedPassword, email },
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to update password.",
      error: error.message,
    });
  }
};
