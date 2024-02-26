// Import dependencies
const { default: mongoose } = require("mongoose");

// Import files
const RatingAndReivew = require("../models/RatingAndReviews");
const Course = require("../models/Course");

/**
 * #### Create a new rating and review for a course
 *
 * - Expects: rating, review, and courseId in req body.
 * - Checks: if all required fields are present.
 * - Checks: if the user is enrolled in the specified course.
 * - Checks: if the user has already reviewed the course.
 * - Saves: rating and review to the database.
 * - Updates: the course in the database with the new rating and review.
 * - Returns: success status and the created rating and review data.
 *
 * @param {Object} req - The request object containing rating, review, and courseId.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status and the created rating and review data.
 */
exports.createRatingAndReview = async (req, res) => {
  try {
    // Fetch data from the request body
    const { rating, review, courseId } = req.body;

    // Fetch the user ID from the request
    const userId = req.user._id;

    // Check if all required fields are present
    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if the user is enrolled in the specified course
    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: userId,
    });
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    // Check if the user has already reviewed the course
    const existingReview = await RatingAndReivew.findOne({
      course: courseId,
      user: userId,
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course.",
      });
    }

    // Create a new rating and review
    const ratingAndReview = await RatingAndReivew.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Update the course with the new rating and review
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { ratingsAndReviews: ratingAndReview._id },
      },
      { new: true }
    );

    // Send the success status and data
    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully.",
      data: {
        ratingAndReview,
        updatedCourse,
      },
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create rating and review.",
      error: error.message,
    });
  }
};

/**
 * #### Get average rating for a course
 *
 * - Expects: courseId in req body.
 * - Calculates: the average rating for the specified course.
 * - Returns: success status and the average rating.
 *
 * @param {Object} req - The request object containing the courseId.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status and the average rating.
 */

exports.getAverageRating = async (req, res) => {
  try {
    // Fetch the courseId from the request body
    const courseId = req.body.courseId;

    // Check if the courseId is present
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    // Calculate the average rating
    const course = await RatingAndReivew.aggregate([
      {
        $match: { course: mongoose.Types.ObjectId(courseId) },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // If no rating is found, return an error
    if (course.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No rating found for the course.",
      });
    }

    // Send the success status and data
    return res.status(200).json({
      success: true,
      message: "Average rating fetched successfully.",
      data: course[0],
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch average rating.",
      error: error.message,
    });
  }
};

/**
 * #### Get All Ratings: Retrieves all ratings and reviews from the database.
 *
 * - Returns: success status and all reviews data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status and all reviews data.
 */
exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image", // Specify the fields to populate from the "Profile" model
      })
      .populate({
        path: "course",
        select: "courseName", //Specify the fields to populate from the "Course" model
      })
      .exec();

    res.status(200).json({
      success: true,
      data: allReviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message,
    });
  }
};

/**
 * #### Delete a rating and review
 *
 * - Expects: ratingId and courseId in req body.
 * - Checks: if ratingId and courseId are present in the database.
 * - Deletes: the rating from the RatingAndReview collection and removes its reference from the Course collection.
 * - Returns: success status.
 *
 * @param {Object} req - The request object containing ratingId and courseId.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status.
 */

exports.deleteRating = async (req, res) => {
  try {
    // Fetch rating and course ID from the request body
    const { ratingId, courseId } = req.body;

    // Check if ratingId and courseId are present in database
    const rating = await RatingAndReview.findById(ratingId);
    const course = await Course.findById(courseId);

    // If rating is not found, return an error
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found.",
      });
    }

    // If course is not found, return an error
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Delete the rating in course and rating collection
    await RatingAndReview.deleteOne(rating);
    await Course.findByIdAndUpdate(courseId, {
      $pull: { ratingsAndReviews: ratingId },
    });

    // Send the success status
    return res.status(200).json({
      success: true,
      message: "Rating deleted successfully.",
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete rating.",
      error: error.message,
    });
  }
};
/**
 * #### Edit a rating and review
 *
 * - Expects: ratingId, courseId, rating, and review in req body.
 * - Checks: if ratingId and courseId are present in the database.
 * - Updates: the rating and review details.
 * - Returns: success status and the updated rating data.
 *
 * @param {Object} req - The request object containing ratingId, courseId, rating, and review.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response indicating the success status and the updated rating data.
 */
exports.editRating = async (req, res) => {
  try {
    // Fetch rating and course ID from the request body
    const { ratingId, courseId, rating, review } = req.body;

    // Check if ratingId and courseId are present in database
    const rating = await RatingAndReview.findById(ratingId);
    const course = await Course.findById(courseId);

    // If rating is not found, return an error
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found.",
      });
    }

    // If course is not found, return an error
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Update the rating and review
    const updatedRating = await RatingAndReview.findByIdAndUpdate(
      ratingId,
      {
        rating,
        review,
      },
      { new: true }
    );

    // Send the success status and data
    return res.status(200).json({
      success: true,
      message: "Rating updated successfully.",
      data: updatedRating,
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update rating.",
      error: error.message,
    });
  }
};
