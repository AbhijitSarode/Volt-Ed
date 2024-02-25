/*
  File: Section.js

  Description:
  This file defines the MongoDB schema for course sections (topics), which organize course content
  into logical segments. Each section contains a name and an array of sub-sections (lectures), providing a structured approach to course materials.

  Schema:
  - sectionName: String - The name of the section (topic).
  - subSections: Array - An array of sub-sections (lectures) associated with the topic.

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - Section: MongoDB model representing the 'sections' collection, based on the
    SectionSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Create schema
const SectionSchema = mongoose.Schema(
    {
        sectionName: {
            type: String,
            required: true
        },
        subSections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SubSection',
                required: true
            }
        ]
    }
)

// Export Section Model
module.exports = mongoose.model('Section', SectionSchema)