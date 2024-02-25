/*
  File: passwordUpdatedEmail.js

  Description:
  This file exports a function that generates an email template for confirming a password update.
  The email includes a message notifying the recipient about the successful password update along with the recipient's name, and the email
  address whose password has been updated. Inline CSS is used for styling.

  Function:
  - passwordUpdatedEmail(email, name): Generates an email template for confirming a password update.
*/

/**
* Generates an email template to notify recipient about successful password update.
* 
*     @param {string} email - The recipient's email address.
*     @param {string} name - The recipient's name to personalize the email.
*/

exports.passwordUpdatedEmail = (email, name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
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
            <div class="message">Password Update Confirmation</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.
                </p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                at
                <a href="mailto:info@volted.com">info@volted.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`
}