/*
  File: AuthMiddleware.js

  Description:
  This file contains middleware functions for user authentication and authorization. These middleware
  functions are used to validate and extract user information from JWT tokens, as well as to check
  user roles such as Student, Instructor, and Admin. The middleware functions are utilized in protecting
  routes and endpoints that require specific user roles.

  Middleware Functions:
  1. auth: Validates and extracts user information from the JWT token.
  2. isStudent: Checks if the user has the "Student" role.
  3. isInstructor: Checks if the user has the "Instructor" role.
  4. isAdmin: Checks if the user has the "Admin" role.

  Dependencies:
  - jsonwebtoken: Library for JSON Web Token handling.
  - dotenv: Library for loading environment variables.
*/

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

/**
 * #### Verify Student Role
 *
 * **Functionality:**
 * - This middleware verifies if the user has the "Student" role.
 *
 * **Account Type Retrieval:**
 * - Retrieves the account type from the user information stored in the request object.
 *
 * **Role Check:**
 * - Checks if the retrieved account type is "Student".
 * - If the account type is not "Student", it denies access to the protected route.
 *
 * **Next Middleware:**
 * - Calls the next middleware function in the stack if the user has the "Student" role.
 *
 * @param {Object} req - The request object containing the user's account type.
 * @param {Object} res - The response object for sending the role verification status.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} - Returns a response indicating the success or failure of the role verification process.
 */
exports.isStudent = async (req, res, next) => {
  try {
    // Retrieve account type from user information
    const accountType = req.user.accountType;
    console.info("Account Type: ", accountType);

    // Check if user has the "Student" role
    if (accountType !== "Student") {
      return res.status(403).json({
        success: false,
        error: "Access Denied",
        message: "You are not authorized to access this resource",
      });
    }

    // Call next middleware in the stack
    next();
  } catch (error) {
    console.error("isStudent Middleware Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Unable to verify role",
      message: error.message,
    });
  }
};

/**
 * #### Verify Instructor Role
 *
 * **Functionality:**
 * - This middleware verifies if the user has the "Instructor" role.
 *
 * **Account Type Retrieval:**
 * - Retrieves the account type from the user information stored in the request object.
 *
 * **Role Check:**
 * - Checks if the retrieved account type is "Instructor".
 * - If the account type is not "Instructor", it denies access to the protected route.
 *
 * **Next Middleware:**
 * - Calls the next middleware function in the stack if the user has the "Instructor" role.
 *
 * @param {Object} req - The request object containing the user's account type.
 * @param {Object} res - The response object for sending the role verification status.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} - Returns a response indicating the success or failure of the role verification process.
 */
exports.isInstructor = async (req, res, next) => {
  try {
    // Retrieve account type from user information
    const accountType = req.user.accountType;
    console.info("Account Type: ", accountType);

    // Check if user has the "Instructor" role
    if (accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        error: "Access Denied",
        message: "You are not authorized to access this resource",
      });
    }

    // Call next middleware in the stack
    next();
  } catch (error) {
    console.error("isInstructor Middleware Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Unable to verify role",
      message: error.message,
    });
  }
};

/**
 * #### Verify Admin Role
 *
 * **Functionality:**
 * - This middleware verifies if the user has the "Admin" role.
 *
 * **Account Type Retrieval:**
 * - Retrieves the account type from the user information stored in the request object.
 *
 * **Role Check:**
 * - Checks if the retrieved account type is "Admin".
 * - If the account type is not "Admin", it denies access to the protected route.
 *
 * **Next Middleware:**
 * - Calls the next middleware function in the stack if the user has the "Admin" role.
 *
 * @param {Object} req - The request object containing the user's account type.
 * @param {Object} res - The response object for sending the role verification status.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} - Returns a response indicating the success or failure of the role verification process.
 */
exports.isAdmin = async (req, res, next) => {
  try {
    // Retrieve account type from user information
    const accountType = req.user.accountType;
    console.info("Account Type: ", accountType);

    // Check if user has the "Admin" role
    if (accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        error: "Access Denied",
        message: "You are not authorized to access this resource",
      });
    }

    // Call next middleware in the stack
    next();
  } catch (error) {
    console.error("isAdmin Middleware Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Unable to verify role",
      message: error.message,
    });
  }
};
