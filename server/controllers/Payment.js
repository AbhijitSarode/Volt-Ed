/*
  Description:
  This file contains controller functions for handling payments related to course enrollment using the Razorpay payment gateway. 
  These functions include capturing payments and verifying payment signatures.

  Controller Functions:
  1. capturePayment: Initiates the Razorpay payment process for course enrollment.
  2. verifySignature: Verifies the signature of Razorpay and our server for the payment.

  Dependencies:
  - mongoose: MongoDB object modeling tool.
  - dotenv: Module to load environment variables.
  - instance from Razorpay configuration file: Razorpay instance for initiating payments.
  - Course model: Model representing courses data.
  - User model: Model representing users data.
  - mailSender utility function: Function to send emails using NodeMailer service.
  - courseEnrollmentEmail email template: Template for successful course enrollment email.
*/

// Import dependencies
const { default: mongoose } = require("mongoose");
require("dotenv").config(); // Load environment variables

// Import files
const { instance } = require("../config/razorpay"); // Import razorpay instance
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender"); // Import mailSender to send mail using nodeMailer service
const { courseEnrollmentEmail } = require("../mails/courseEnrollmentEmail"); // Import successful course enrollment email template

/**
 * #### Capture Payment: Initiates the Razorpay payment process for course enrollment.
 *
 * - Expects: course_id in req body.
 * - Checks: if course_id is present.
 * - Validates: course details, ensuring the course exists and the student hasn't enrolled already.
 * - Creates: a payment order using Razorpay with the specified amount, currency, and notes.
 * - Returns: success status, a message, and payment transaction details.
 *
 * @param {Object} req - The request object containing course_id.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status, message, and payment transaction details.
 */
exports.capturePayment = async (req, res) => {
  try {
    // Fetch user and course details from the request
    const { course_id } = req.body;
    const user = req.user.id;

    // Check if the course_id is present
    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    // Find the course and user details from the database
    const course = await Course.findById(course_id);
    const student = await User.findById(user);

    // Check if the course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Check if the student has already enrolled in the course
    if (student.courses.includes(course_id)) {
      // Might give error
      return res.status(400).json({
        success: false,
        message: "You have already enrolled in this course.",
      });
    }

    try {
      // Create payment order
      const amount = course.price;
      const currency = "INR";

      const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency,
        receipt: Math.random(Date.now()).toString(36).substring(7),
        notes: {
          course_id: course_id,
          user_id: user,
        },
      };
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unable to create payment order.",
        error: error.message,
      });
    }

    try {
      // Initiate payment
      const order = await instance.orders.create(options);
      console.log(`Payment order created: ${order}`);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unable to initiate payment.",
        error: error.message,
      });
    }
  } catch (error) {
    // Send the error message
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to capture payment.",
      error: error.message,
    });
  }
};

/**
 * #### Verify Signature: Verifies the signature of Razorpay and our server for the payment.
 *
 * - Expects: Razorpay signature in x-razorpay-signature header.
 * - Encrypts: the secret using sha256 algorithm.
 * - Compares: the encrypted secret with the Razorpay signature.
 * - If Matches: Enrolls the student in the course, sends confirmation email, and returns success status.
 *
 * @param {Object} req - The request object containing x-razorpay-signature header and payload.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status, message, and enrollment details.
 */
exports.verifySignature = async (req, res) => {
  try {
    // Signatures
    const webhoookSecret = process.env.WEBHOOK_SECRET;
    const razorpaySignature = req.headers["x-razorpay-signature"];

    // Encrypt Secret
    const shasum = crypto.createHmac("sha256", webhoookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    // Compare encrypted Secret & Signature
    if (razorpaySignature === digest) {
      console.log("Payment is authorized");

      // Fetch data sent by Razorpay from notes
      const { userId, courseId } = req.body.payload.payment.entity.notes;

      try {
        // Find course & enroll student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );

        console.info(`Enrolled course: ${enrolledCourse}`);

        if (!enrolledCourse) {
          console.error(error.message);
          return res.status(501).json({
            success: false,
            message: "Unable to find course & enroll student to it",
          });
        }

        console.info(`Enrolled course: ${enrolledCourse}`);

        // Find student & add enrolled course in it
        const enrollStudent = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { courses: courseId } },
          { new: true }
        );

        console.info(`Enrolled student: ${enrollStudent}`);

        // Send payment & enrollment successful mail
        const mail = await mailSender(
          enrollStudent.email,
          "Congratulations from Volt-Ed",
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            enrollStudent.firstName
          )
        );

        console.info(`Email: ${mail}`);

        return res.status(200).json({
          success: true,
          message: "Signature verified & course added",
          data: {
            razorpaySignature,
            enrolledCourse,
            enrollStudent,
          },
        });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({
          success: false,
          message: "Internal error",
        });
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};
