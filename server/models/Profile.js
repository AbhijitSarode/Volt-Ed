/*
  File: Profile.js

  Description:
  This file defines the MongoDB schema for user profile's additional information. It includes fields for gender,
  date of birth, about (bio), and contact information. These fields provide comprehensive
  details about the user and are essential for various features within the application.

  Schema:
  - gender: String - The gender of the user.
  - dateOfBirth: String - The date of birth of the user.
  - about: String - A brief description or bio of the user.
  - contact: String - Contact information of the user.

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - Profile: MongoDB model representing the 'profile' collection, based on the profileSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Define Profile Schema
const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
})

// Export Profile Model
module.exports = mongoose.model('Profile', profileSchema)