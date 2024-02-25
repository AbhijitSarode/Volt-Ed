/*
  File: SubSection.js

  Description:
  This file defines the MongoDB schema for sub-sections (lectures) within course. 
  Each sub-section contains information such as title, description, duration, and a link to the content (e.g., video URL).

  Schema:
  - title: String - The title of the sub-section (lecture).
  - description: String - Description of the lecture.
  - timeDuration: String - The duration of the lecture.
  - videoUrl: String - URL link to the video.
  - createdAt: Date - The date and time when the lecture was created.

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - SubSection: MongoDB model representing the 'subsections' collection, based on the
    SubSectionSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Create schema
const SubSectionSchema = mongoose.Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        timeDuration: {
            type: String
        },
        videoUrl: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

// Export SubSection Model
module.exports = mongoose.model('SubSection', SubSectionSchema)