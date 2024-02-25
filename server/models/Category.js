/*
  File: Category.js

  Description:
  This file defines the MongoDB schema for categories. Categories are used to organize courses
  on the platform. Each category has a name, a description, and may contain references to the courses
  belonging to that category.

  Schema:
  - name: String (required) - The name of the category.
  - description: String (required) - Description of the category.
  - courses: Array of ObjectIds - References to courses belonging to this category.

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - Category: MongoDB model representing the 'categories' collection, based on the CategorySchema.
*/


// Import dependencies
const mongoose = require('mongoose')

// Create schema
const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ]
    }
)

// Export Category Model
module.exports = mongoose.model('Category', CategorySchema)