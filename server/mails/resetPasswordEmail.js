/*
  File: resetPasswordEmail.js

  Description:
  This file exports a function that generates an email template for resetting a password.
  The email includes a message notifying the recipient about a password reset request, instructions
  on how to reset the password, and a link to initiate the password reset process. Inline CSS
  is used for styling.

  Functions:
  - resetPasswordMail(link, name): Generates an email template for resetting a password.
*/

/**
* Generates an email template to notify recipient about password reset request.
* 
*  @param {string} link - The reset password link to include in the email.
*  @param {string} name - The recipient's name to personalize the email.
*/

exports.resetPasswordMail = (link, name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Reset Request | Volt-Ed</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
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
        </style>
    
    </head>
    
    <body>
        <div class="container">
        <a href="https://volt-ed.vercel.app"><img src="https://res.cloudinary.com/dz5udop6p/image/upload/f_auto,q_auto/v1/Volted%20Static%20Assets/logo/jjfj3e6mn5crvnb8v5dd" style="width:280px; height:60px; margin-bottom: 20px;" /></a>
            <div class="message">Password Reset update</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>We have received a request to reset the password associated with your account. To proceed with the password reset, please follow the instructions below: </p>
                <ol>
                    <li>Click on the following link to reset your password:</li><br/><a href="${link}" class="button">Reset my password</a>
                    <li>If the link does not work, copy and paste below link into your browser's address bar.</li>
                </ol>
                ${link}
                <p>Please ignore this email if you did not initiate this password reset request. Your account will remain secure.</p>
            </div>
            <div class="support">If you encounter any issues or need further assistance, please do not hesitate to contact our support team at
                <a href="mailto:info@volted.com">info@volted.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`
}