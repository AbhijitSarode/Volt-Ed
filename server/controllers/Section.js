// Import files
const Section = require("../models/Section"); // Section model
const Course = require("../models/Course"); // Course model

/**
 * #### Add a new section to a course
 *
 * **Functionality:**
 * - Expects sectionName and courseId in the request body.
 * - Checks if all required fields are present.
 * - Creates a new section in the Section database.
 * - Updates the courseContent array in the Course database with the new section.
 *
 * **Returns:**
 * - Success status, the created section data, and the updated course data.
 *
 * @param {Object} req - The request object containing the sectionName and courseId.
 * @param {Object} res - The response object to send the success status and data.
 * @returns {Object} - Returns a response containing the success status, created section data, and updated course data.
 */
exports.createSection = async (req, res) => {
  try {
    // Fetch the courseID and sectionName from the request body
    const { sectionName, courseId } = req.body;

    // Check if the required fields are present
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create a new section
    const section = await Section.create({ sectionName });

    // Find the course and update the courseContent array
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: section._id },
      },
      { new: true }
    );

    // Send the success status and data
    res.status(201).json({
      success: true,
      message: "Section created successfully.",
      data: {
        section,
        course,
      },
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to create section.",
      error: error.message,
    });
  }
};
