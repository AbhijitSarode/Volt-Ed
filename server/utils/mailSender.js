/*
  File: mailSender.js

  Description:
  This file contains a function to send emails using Nodemailer. It creates a transporter using
  the provided email host, username, and password from environment variables. The sendEmail function
  sends an email with the specified email ID, subject, and body content.

  Functions:
  - sendEmail(emailID, subject, body): Sends an email with the provided details.
*/

const nodemailer = require('nodemailer')

/**
 * Sends an email with the provided details.
 * 
 * @param {string} emailID - Email address of the recipient.
 * @param {string} subject - Subject of the email.
 * @param {string} body - Body content of the email.
 */
const sendEmail = async (emailID, subject, body) => {
    try {
        // Create a transporter using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        // Send email
        let mail = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: `${emailID}`,
            subject: `${subject}`,
            html: `${body}`
        })
    } catch (err) {
        console.error(err)
    }
}

module.exports = sendEmail
