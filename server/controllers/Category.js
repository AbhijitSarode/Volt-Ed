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

/**
 * #### Get All Categories: Retrieves all categories from the database
 *
 * **Functionality:**
 * - This function retrieves all categories from the database.
 *
 * **Returns:**
 * - Success status and an array of all categories with name and description.
 *
 * @param {Object} req - The request object (not used).
 * @param {Object} res - The response object to send the success status and categories data.
 * @returns {Object} - Returns a response containing the success status and an array of categories.
 */
exports.getAllCategories = async (req, res) => {
  try {
    // Get all categories from the database
    const categories = await Category.find(
      {},
      { name: true, description: true }
    ).exec();

    // Send the success status and an array of categories
    return res.status(200).json({
      success: true,
      message: "Retrieved all categories successfully",
      data: categories,
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve categories",
      error: error.message,
    });
  }
};

/**
 * #### Get category details
 *
 * **Functionality:**
 * - This function retrieves details of a specific category.
 *
 * **Expects:**
 * - Expects category ID in the request body.
 *
 * **Retrieves:**
 * - Retrieves courses for the specified category.
 *
 * **Calculates:**
 * - Calculates other courses and most selling courses.
 *
 * **Returns:**
 * - Success status and an object with selectedCourses, otherCourses, and mostSellingCourses.
 *
 * @param {Object} req - The request object containing the category ID.
 * @param {Object} res - The response object to send the success status and category details.
 * @returns {Object} - Returns a response containing the success status and category details.
 */
exports.getCategoryDetails = async (req, res) => {
  try {
    // Fetch category ID from the request body
    const { categoryId } = req.body;

    // If category not found
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide category ID",
      });
    }

    // Get courses for the specified category
    const selectedCourses = await Course.findById(categoryId)
      .populate("courses")
      .exec();

    // If courses not found
    if (!selectedCourses) {
      return res.status(404).json({
        success: false,
        message: "Courses not found",
      });
    }

    // Get other categories
    const otherCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate("courses")
      .exec();

    let otherCourses = [];
    for (let category of otherCategories) {
      otherCourses = [...otherCourses, ...category.courses];
    }

    // Get most selling courses for the specified category
    const allCategories = await Category.find().populate("courses").exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // Send the success status and category details
    return res.status(200).json({
      success: true,
      message: "Retrieved category details successfully",
      data: {
        selectedCourses,
        otherCourses,
        mostSellingCourses,
      },
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve category details",
      error: error.message,
    });
  }
};

/**
 * #### Delete an existing category
 *
 * **Functionality:**
 * - This function deletes an existing category from the database.
 *
 * **Expects:**
 * - Expects categoryId in the request body.
 *
 * **Deletes:**
 * - Deletes the category from the database.
 *
 * **Returns:**
 * - Success status and a message indicating the deletion status.
 *
 * @param {Object} req - The request object containing the category ID.
 * @param {Object} res - The response object to send the success status and deletion message.
 * @returns {Object} - Returns a response containing the success status and deletion message.
 */
exports.deleteCategory = async (req, res) => {
  try {
    // Fetch category ID from the request body
    const { categoryId } = req.body;

    // If category not found
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide category ID",
      });
    }

    // Delete the category from the database
    await Category.findByIdAndDelete(categoryId);

    // Send the success status and deletion message
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    // Send the error message
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete category",
      error: error.message,
    });
  }
};
