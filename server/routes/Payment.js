// Import dependencies
const express = require("express");
const router = express.Router();

// Import middleware
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// Import controller
const { capturePayment, verifySignature } = require("../controllers/Payment");

/**
 * #### Payment Routes
 *
 * Functionality:
 *   - These routes handle the payment process, including capturing payments and verifying payment signatures.
 *  - The routes are protected and require the user to be authenticated before accessing them.
 *
 * - Middleware Used:
 *   - auth: Middleware to verify user's credentials.
 *   - isInstructor: Middleware to check if the user is an instructor.
 *   - isStudent: Middleware to check if the user is a student.
 *   - isAdmin: Middleware to check if the user is an admin.
 *
 * - Endpoints:
 *   - Capture Payment Route:
 *     - POST /capturePayment: Captures payment for a student. [Protected, Student]
 *
 *   - Verify Signature Route:
 *     - POST /verifySignature: Verifies the payment signature. [Public]
 */

// Capture Payment Route
router.post("/capturePayment", auth, isStudent, capturePayment);

// Verify Signature Route
router.post("/verifySignature", verifySignature);

module.exports = router;
