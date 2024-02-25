/*
  File: OTP.js

  Description:
  This file defines the MongoDB schema for One-Time Password (OTP) generation and verification.
  It includes fields for email, OTP, and creation timestamp. The OTP is automatically deleted
  after 300 seconds (5 mins) to ensure security. Additionally, it provides functionality to
  send OTP verification emails using a predefined template before saving it to the database.

  Schema:
  - email: String - The recipient's email address.
  - otp: String - The generated One-Time Password.
  - createdAt: Date - The timestamp indicating when the OTP was created. It automatically expires
    after a certain period (default: 5 minutes).

  Functions:
  1. sendVerificationEmail(email, otp): Prepares and sends a verification email with the OTP.
     Parameters:
       - email: string - The recipient's email address.
       - otp: string - The One-Time Password to be included in the email for verification.
     Returns:
       - Promise: The result of sending the email.
     Throws:
       - Error: If an error occurs while sending the email.

  2. OTPSchema.pre("save", async function (next)): Middleware function executed before saving
     an OTP instance to the database. It sends a verification email to the recipient's email
     address using the provided OTP. This ensures that the user receives the OTP before it
     is saved to the database.

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
  - mailSender: Utility function for sending emails.
  - otpTemplate: Email template for OTP verification.

  Exported Model:
  - OTP: MongoDB model representing the 'otp' collection, based on the OTPSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Import files
const mailSender = require('../utils/mailSender') // Mail sender for sending OTP
const otpTemplate = require('../mails/verificationEmail') // Email template for OTP verification

// Create schema
const OTPSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300
        }
    }
)


/** Prepare OTP email for sending.
* @param {string} email - The recipient's email address.
* @param {string} otp - The One-Time Password to be included in the email for verification.
* @returns {Promise} - The result of sending the email.
* @throws {Error} - The error that occurred while sending the email.
*/

const sendVerificationEmail = async (email, otp) => {
    try {
        const mail = await mailSender(email, "Verification Email from Volt-Ed", otpTemplate(otp))
        console.info(`Email sent successfully: ${mail}`)
    } catch (error) {
        console.error(`Error occured while sending mail: ${error.message}`)
    }
}


// Send the OTP to the user's email before saving the OTP to the database.
OTPSchema.pre("save", async function (next) {

    await sendVerificationEmail(this.email, this.otp)
    next()
})

// Export OPT Model
module.exports = mongoose.model('OTP', OTPSchema)