/*
  Description:
  This file contains controller functions for managing sections related to courses in the application. 
  These functions handle operations such as adding a new section to a course, deleting a section from a course, editing a section, and retrieving all sections.

  Controller Functions:
  1. createSection: Adds a new section to a course.
  2. deleteSection: Deletes a section from a course.
  3. updateSection: Edits a section.
  4. getAllSections: Retrieves all sections.

  Dependencies:
  - Section model: Model representing sections data.
  - Course model: Model representing course data.
*/

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

/**
 * #### Delete a section from a course
 *
 * - Expects: sectionId in req params.
 * - Finds: the section in the Section database.
 * - Deletes: the section from the Section database.
 * - Returns: success status.
 *
 * @param {Object} req - The request object containing sectionId in params.
 * @param {Object} res - The response object to send the success status.
 * @returns {Object} - Returns a response containing the success status.
 */
exports.deleteSection = async (req, res) => {
  try {
    // Fetch the sectionId from the request params
    const { sectionId } = req.params;

    // Find section in database
    const section = await Section.findById(sectionId);

    // Check if section exists
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found.",
      });
    }

    // Delete the section
    await Section.deleteOne(section); // May give error

    // Send the success status
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully.",
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to delete section.",
      error: error.message,
    });
  }
};

/**
 * #### Edit section
 *
 * - Expects: SectionName in req body.
 * - Checks: if all required fields are present.
 * - Updates: section details in the Section database.
 * - Returns: success status and the updated section data.
 *
 * @param {Object} req - The request object containing sectionName
 * @param {Object} res - The response object to send the success status and updated section data.
 * @returns {Object} - Returns a response containing the success status and the updated section data.
 */
exports.updateSection = async (req, res) => {
  try {
    // Fetch the SectionName & subSections from the request body
    const { sectionName, subSections } = req.body;

    // Check if the sectionName & array of subSection is present
    if (!sectionName || !subSections) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Update the section
    const section = await Section.findByIdAndUpdate(
      req.params.sectionId,
      {
        sectionName,
        subSections,
      },
      { new: true }
    );

    // Send the success status and updated section data
    return res.status(200).json({
      success: true,
      message: "Section updated successfully.",
      data: section,
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to update section.",
      error: error.message,
    });
  }
};

/**
 * #### Get all sections
 *
 * - Returns: success status and an array containing section data.
 *
 * @param {Object} req - The request object (not used in the function).
 * @param {Object} res - The response object to send the section data.
 * @returns {Object} - Returns a response containing the success status and the section data.
 */
exports.getAllSections = async (req, res) => {
  try {
    // Fetch courseID from the request params
    const sections = await Section.find({}, { courseContent: true })
      .populate("courseContent")
      .exec(); // May give error

    // If no sections are found
    if (!sections) {
      return res.status(404).json({
        success: false,
        message: "No sections found.",
      });
    }

    // Send the success status and section data
    return res.status(200).json({
      success: true,
      message: "Sections retrieved successfully.",
      data: sections,
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve sections.",
      error: error.message,
    });
  }
};
