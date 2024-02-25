// Import dependencies
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import files
const User = require("../models/User");

/**
 * #### Extract and Validate JWT Token
 *
 * **Functionality:**
 * - This middleware validates and extracts user information from the JWT token attached to the request.
 *
 * **Extraction:**
 * - Extracts the token from the cookie, request body, or header depending on the available sources.
 *
 * **Validation:**
 * - Checks if the token is present in any of the expected sources.
 * - Verifies the authenticity of the token using the JWT_SECRET provided.
 *
 * **User Information:**
 * - Sets the decoded user information extracted from the token into the request object for further processing.
 *
 * **Next Middleware:**
 * - Calls the next middleware function in the stack to continue the request processing.
 *
 * @param {Object} req - The request object containing the token.
 * @param {Object} res - The response object for sending authentication status.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} - Returns a response indicating the success or failure of the token validation process.
 */

exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookie, body, or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.headers("Authorization").replace("Bearer ", "");

    // Check if token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token is missing",
      });
    }

    // Verify token and extract user information
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.info("Decoded Token: ", decodedToken);

      // Set user information in request object for further processing by other middlewares or routes
      req.user = decodedToken;
    } catch (error) {
      console.error("Token Verification Error: ", error);
      return res.status(401).json({
        success: false,
        error: "Token is invalid",
        message: error.message,
      });
    }

    // Call next middleware in the stack
    next();
  } catch (error) {
    console.error("Auth Middleware Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Unable to validate token",
      message: error.message,
    });
  }
};
