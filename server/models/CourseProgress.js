/*
  File: CourseProgress.js

  Description:
  This file defines the MongoDB schema for tracking the progress of students in courses. It stores
  information about the completed videos within a course. Each entry in the CourseProgress collection
  corresponds to a user's progress in a specific course, identified by the courseId.

  Schema:
  - courseId: ObjectId - Reference to the course for which progress is tracked (Course model).
  - completedVideos: Array of ObjectIds - References to the completed videos (SubSection model).

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - CourseProgress: MongoDB model representing the 'courseprogress' collection, based on the CourseProgressSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Create schema
const CourseProgressSchema = mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        completedVideos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SubSection'
            }
        ],
    }
)

// Export CourseProgress Model
module.exports = mongoose.model('CourseProgress', CourseProgressSchema)