/*
  File: Course.js

  Description:
  This file defines the MongoDB schema for courses. Each course has a name, description,
  what you will learn, price, thumbnail, tags, instructor, course content, category, and
  students enrolled. The course schema includes references to other MongoDB models such as
  users (instructor and students) and sections (course content).

  Schema:
  - courseName: String (required) - The name of the course.
  - courseDescription: String (required) - Description of the course.
  - whatYouWillLearn: String - Information about what students will learn in the course.
  - price: Number (required) - The price of the course.
  - thumbnail: String - URL to the course thumbnail image.
  - tag: Array of Strings (required) - Tags associated with the course.
  - instructor: ObjectId (required) - Reference to the instructor of the course (User model).
  - courseContent: Array of ObjectIds - References to sections comprising the course content (Section model).
  - category: ObjectId - Reference to the category to which the course belongs (Category model).
  - studentsEnrolled: Array of ObjectIds - References to students enrolled in the course (User model).

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - Course: MongoDB model representing the 'courses' collection, based on the CourseSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Create schema
const CourseSchema = mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
            trim: true
        },
        courseDescription: {
            type: String,
            required: true,
            trim: true
        },
        whatYouWillLearn: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        thumbnail: {
            type: String
        },
        tag: {
            type: [String],
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        courseContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Section'
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    }
)

// Export Course Model
module.exports = mongoose.model('Course', CourseSchema)