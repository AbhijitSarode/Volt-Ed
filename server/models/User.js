/*
  File: User.js

  Description:
  This file defines the MongoDB schema for user profiles within the application. It includes
  fields such as first name, last name, email, password, account type, profile image, and
  references to related models such as Profile, Courses, and CourseProgress. The schema
  supports different account types (Admin, Instructor, Student) and provides fields for
  account activation, approval status, and token management.

  Schema:
  - firstName: String - The first name of the user.
  - lastName: String - The last name of the user.
  - email: String - The email address of the user.
  - password: String - The password of the user.
  - accountType: String - The type of account (Admin, Instructor, Student).
  - active: Boolean - Indicates whether the user account is active.
  - approved: Boolean - Indicates whether the user account is approved.
  - image: String - URL link to the user's profile image.
  - token: String - Authentication token for the user.
  - resetPasswordExpires: Date - Expiry date for reset password requests.
  - Profile: ObjectId - Reference to the user's profile information.
  - Courses: Array - References to courses associated with the user.
  - courseProgress: Array - References to course progress tracking for the user.
  - createdAt: Date - The date and time when the user account was created.

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - User: MongoDB model representing the 'users' collection, based on the UserSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Create schema
const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        accountType: {
            type: String,
            required: true,
            enum: ['Admin', 'Instructor', 'Student'],
        },
        active: {
            type: Boolean,
            default: true
        },
        approved: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        Profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        },
        Courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CourseProgress'
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

// Export User Model
module.exports = mongoose.model('User', UserSchema)