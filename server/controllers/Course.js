// Import files
const Course = require("../models/Course"); // Course model
const Category = require("../models/Category"); // Category model
const User = require("../models/User"); // User model
const { uploadFileToCloudinary } = require("../utils/fileUploader"); // Cloudinary file uploader

/**
 * #### Create Course
 *
 * **Functionality:**
 * - This function adds a new course to the database.
 *
 * **Input:**
 * - Expects course details in the request body and a thumbnail file.
 *
 * **Checks:**
 * - Validates the presence of all required fields in the request body.
 * - Ensures that the provided category exists in the database.
 *
 * **Processing:**
 * - Uploads the thumbnail file to Cloudinary for storage.
 * - Retrieves instructor details from the logged-in user.
 *
 * **Database Updates:**
 * - Adds the new course to the Course collection in the database.
 * - Updates the instructor's profile with the newly created course.
 * - Updates the course category with the newly created course.
 *
 * **Returns:**
 * - Success status indicating the course creation was successful.
 * - The created course data for further reference.
 *
 * @param {Object} req - The request object containing course details and thumbnail file.
 * @param {Object} res - The response object for sending the course creation status.
 * @returns {Object} - Returns a response indicating the success or failure of the course creation process.
 */
exports.createCourse = async (req, res) => {
  try {
    // Fetch data from the request body
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;
    const thumbnail = req.files.thumbnail;

    // Validate the presence of all required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get course category from the database
    const courseCategory = await Category.findOne({ category });
    if (!courseCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Upload thumbnail to Cloudinary
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Get instructor details
    const instructor = req.user.id;
    const instructorDetails = await User.findById(instructor);

    // If instructor details are not found
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Create new course object
    const newCourse = {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category: courseCategory._id,
      instructor: instructorDetails._id,
      thumbnail: thumbnailImage.secure_url,
    };

    // Add the new course to the database
    await Course.create(newCourse);

    // Update instructor's profile with the new course
    await User.findByIdAndUpdate(
      { _id: instructor._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create course",
      error: error.message,
    });
  }

  /**
   * #### Fetch All Courses
   *
   * **Functionality:**
   * - This function retrieves basic details of all courses from the database.
   *
   * **Input:**
   * - No parameters required.
   *
   * **Returns:**
   * - Success status indicating the successful retrieval of courses.
   * - Message confirming the successful fetching of all courses.
   * - An array of course data with limited details including course name, description, price, thumbnail, instructor, number of students enrolled, and rating/reviews.
   *
   * @param {Object} req - The request object (no parameters required).
   * @param {Object} res - The response object for sending the fetched course details.
   * @returns {Object} - Returns a response containing course details upon successful retrieval.
   */
  exports.getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find(
        {},
        {
          courseName: true,
          courseDescription: true,
          price: true,
          thumbnail: true,
          instructor: true,
          studentsEnrolled: true,
          ratingAndReviews: true,
        }
      )
        .populate("Instructor") // Might get error here
        .exec();

      res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to fetch courses",
        error: error.message,
      });
    }
  };
};

/**
 * #### Fetch Course Details
 *
 * **Functionality:**
 * - This function retrieves detailed information about a specific course from the database.
 *
 * **Input:**
 * - Expects the courseId in the request body.
 *
 * **Populations:**
 * - Populates instructor details, category, rating and reviews, and course content with sub-section details to provide comprehensive information.
 *
 * **Returns:**
 * - Success status indicating the successful retrieval of course details.
 * - Message confirming the successful retrieval of detailed data about the specified course.
 * - Detailed data about the specified course including instructor details, category, rating and reviews, and course content with sub-section details.
 *
 * @param {Object} req - The request object containing the courseId.
 * @param {Object} res - The response object for sending the detailed course data.
 * @returns {Object} - Returns a response containing detailed course information upon successful retrieval.
 */
exports.getCourseAllDetails = async (req, res) => {
  try {
    // Fetch courseId from the request body
    const { courseId } = req.body;

    // Get all course details from the database
    const courseAllData = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "addtionaDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // If course details are not found
    if (!courseAllData) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseAllData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course details",
      error: error.message,
    });
  }
};

/**
 * #### Efit Course Details
 *
 * **Functionality:**
 * - This function updates the details of an existing course in the database.
 *
 * **Input:**
 * - Expects the courseId in the request body and optional updated course details.
 *
 * **Checks:**
 * - Validates if at least one field to update is present.
 * - Ensures the existence of the provided category in the database.
 *
 * **Processing:**
 * - Uploads the updated thumbnail to Cloudinary if provided.
 *
 * **Database Updates:**
 * - Updates the course details in the database with the provided changes.
 *
 * **Returns:**
 * - Success status indicating the successful update of course details.
 * - Message confirming the successful update of the course.
 * - Updated course data containing the modified details.
 *
 * @param {Object} req - The request object containing the courseId and optional updated course details.
 * @param {Object} res - The response object for sending the updated course details.
 * @returns {Object} - Returns a response containing the updated course information upon successful update.
 */
exports.editCourse = async (req, res) => {
  try {
    // Fetch data from the request body
    const {
      courseId,
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
    } = req.body;
    const thumbnail = req.files.thumbnail;

    // Check if at least one field to update is present
    if (
      !courseName &&
      !courseDescription &&
      !whatYouWillLearn &&
      !price &&
      !category &&
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field to update is required",
      });
    }

    // Get course details from the database
    const course = await Course.findById(courseId);

    // If course details are not found
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found for courseId: " + courseId,
      });
    }

    // Get category details from the database
    const courseCategory = await Category.findById(category);

    // If category details are not found
    if (!courseCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Initialize updated course filed object
    const updatedFields = {};

    // Update fields if provided
    if (courseName) updatedFields.courseName = courseName;
    if (courseDescription) updatedFields.courseDescription = courseDescription;
    if (whatYouWillLearn) updatedFields.whatYouWillLearn = whatYouWillLearn;
    if (price) updatedFields.price = price;
    if (category) updatedFields.category = category._id;
    if (thumbnail)
      updatedFields.thumbnail = (
        await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME)
      ).secure_url;

    // Update course details in the database
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId }, // Might get error here
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update course",
      error: error.message,
    });
  }
};
