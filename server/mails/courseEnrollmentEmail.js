/*
  File: courseEnrollmentEmail.js

  Description:
  This file exports a function that generates an email template for confirming course enrollment.
  The email includes a message notifying the recipient about successful course registration,
  along with instructions to access course materials and a link to the learning dashboard. Inline CSS
  is used for styling.

  Function:
  - courseEnrollmentEmail(courseName, name): Generates an email template for confirming course enrollment.
*/

/**
*
* Generates an email template to notify student about successful course enrollment.
* @param {string} courseName - The name of the enrolled course.
* @param {string} name - The recipient's name to personalize the email.
*/

exports.courseEnrollmentEmail = (courseName, name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Course Registration Confirmation</title>
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
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
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
            <div class="message">Course Registration Confirmation</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>You have successfully registered for the course <span class="highlight">"${courseName}"</span>. We
                    are excited to have you as a participant!</p>
                <p>Please log in to your learning dashboard to access the course materials and start your learning journey.
                </p>
                <a class="cta" href="https://volt-ed.vercel.app/dashboard">Go to Dashboard</a>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                    href="mailto:info@volted.com">info@volted.com</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`
}