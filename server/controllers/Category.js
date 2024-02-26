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

/**
 * #### Edit an existing category
 *
 * **Functionality:**
 * - This function updates details of an existing category in the database.
 *
 * **Input:**
 * - Expects categoryId in the request body and optional updated category details.
 *
 * **Checks:**
 * - Validates if categoryId is present and at least one field to update is provided.
 *
 * **Database Operation:**
 * - Gets the existing category details from the database.
 * - Updates category details in the database with the provided fields.
 *
 * **Returns:**
 * - Success status and the updated category data.
 *
 * @param {Object} req - The request object containing category ID and updated details.
 * @param {Object} res - The response object to send the success status and updated data.
 * @returns {Object} - Returns a response containing the success status and updated category data.
 */
exports.editCategory = async (req, res) => {
  try {
    // Fetch category details from the request body
    const { categoryId, name, description } = req.body;

    // Check if categoryId is present
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide category ID",
      });
    }

    // Get the existing category details from the database
    const category = await Category.findById(categoryId);

    // Check if category exists
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Initialize an object to store updated category details
    const updatedFields = {};

    // Add the updated fields to the object if provided
    if (name !== undefined) updatedFields.name = name;
    if (description !== undefined) updatedFields.description = description;

    // Check if at least one field to update is provided
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    // Update category details in the database
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedFields,
      { new: true }
    );

    // Send the success status and updated category data
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update category",
      error: error.message,
    });
  }
};
