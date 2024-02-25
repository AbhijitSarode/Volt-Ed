/*
  File: RatingAndReviews.js

  Description:
  This file defines the MongoDB schema for ratings and reviews associated with courses.
  It includes fields for user, rating, review, and course, allowing students to provide
  feedback and ratings for courses they have taken. This schema facilitates tracking
  and displaying course ratings and reviews within the application.

  Schema:
  - user: ObjectId - The student who submitted the rating and review.
  - rating: Number - The rating provided by the student (e.g., 1 to 5 stars).
  - review: String - The text of the review provided by the student.
  - course: ObjectId - The course to which the rating and review are associated.

  Dependencies:
  - mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.

  Exported Model:
  - RatingAndReviews: MongoDB model representing the 'ratingAndReviews' collection,
    based on the RatingAndReviewsSchema.
*/

// Import dependencies
const mongoose = require('mongoose')

// Create schema
const RatingAndReviewsSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true
        }
    }
)

// Export RatingAndReviews Model
module.exports = mongoose.model('RatingAndReviews', RatingAndReviewsSchema)