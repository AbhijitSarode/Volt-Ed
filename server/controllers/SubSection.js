// Import dependencies
require("dotenv").config(); // Load environment variables

// Import files
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadFileToCloudinary } = require("../utils/fileUploader"); // Cloudinary file uploader

/**
 * #### Create a new sub-section in a section
 *
 * - Expects: sectionId, title, description, timeDuration, and videoFile in req body.
 * - Checks: if all required fields are present.
 * - Uploads: videoFile to Cloudinary.
 * - Creates: a new sub-section with the provided details.
 * - Updates: the section in the database with the new sub-section.
 * - Returns: success status and the created sub-section data.
 *
 * @param {Object} req - The request object containing sectionId, title, description, timeDuration, and videoFile.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - Returns a response containing the success status and the created sub-section data.
 */
exports.createSubSection = async (req, res) => {
  try {
    // Fetch data from the request body
    const { sectionId, title, description, timeDuration } = req.body;

    // Extract the video file from the request
    const videoFile = req.files.videoFile;

    // Check if all required fields are present
    if (!sectionId || !title || !description || !timeDuration || !videoFile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Upload the video file to Cloudinary
    const video = await uploadFileToCloudinary(
      videoFile,
      process.env.FOLDER_NAME
    );

    // Create a new sub-section
    const subSection = await SubSection.create({
      title,
      description,
      timeDuration,
      videoUrl: video.secure_url,
    });

    // Find the section and update the subSections array
    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSections: subSection._id },
      },
      { new: true }
    )
      .populate("subSection")
      .exec();

    // Send the success status and data
    return res.status(201).json({
      success: true,
      message: "Sub-section created successfully.",
      data: {
        subSection,
        section,
      },
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create sub-section.",
      error: error.message,
    });
  }
};
