// Import files
const Category = require("../models/Category"); // Category model

/**
 * #### Create a new category
 *
 * **Functionality:**
 * - This function adds a new category to the database.
 *
 * **Input:**
 * - Expects category details (name, description) in the request body.
 *
 * **Checks:**
 * - Validates if all required fields are present.
 *
 * **Database Operation:**
 * - Adds the category to the database.
 *
 * **Returns:**
 * - Success status and the created category data.
 *
 * @param {Object} req - The request object containing category details.
 * @param {Object} res - The response object to send the success status and data.
 * @returns {Object} - Returns a response containing the success status and created category data.
 */
exports.createCategory = async (req, res) => {
  try {
    // Fetch category details from the request body
    const { name, description } = req.body;

    // Check if all required fields are present
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Add the category to the database
    const category = await Category.create({ name, description });

    // Send the success status and created category data
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create category",
      error: error.message,
    });
  }
};
