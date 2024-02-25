/*
  File: verificationEmail.js

  Description:
  This file exports a function that generates an email template for OTP (One-Time Password) verification.
  The email contains instructions to complete the registration process by verifying the user's account using the OTP.
  It also provides information about the validity period of the OTP and includes support contact details.

  Function:
  - otpTemplate(otp): Generates an email template for OTP verification.
*/

/**
 * Generates an email template to notify recipient its OTP code.
 * @param {string} otp - The One-Time Password to be included in the email for verification.
 */

const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				margin: 0;
				padding: 0;
			}
			
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
				color: #134781
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
				color: #134781
			}
			
			p {	
				color: #134781
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<a href="https://volt-ed.vercel.app"><img src="https://res.cloudinary.com/dz5udop6p/image/upload/f_auto,q_auto/v1/Volted%20Static%20Assets/logo/jjfj3e6mn5crvnb8v5dd" style="width:280px; height:60px; margin-bottom: 20px;" /></a>
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>Thank you for registering with <strong>Volt-Ed</strong>. To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<h2 class="highlight">${otp}</h2>
				<p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:info@volted.com">info@volted.com</a>. We are here to help!</div>
		</div>

	</body>
	
	</html>`
}
module.exports = otpTemplate