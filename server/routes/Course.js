// Import dependencies
const express = require("express");
const router = express.Router();

// Importing Middlewares
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// Import Controllers
const {
  createCourse,
  getCourseAllDetails,
  getAllCourses,
  editCourse,
  deleteCourse,
} = require("../controllers/Course");
const {
  getAllCategories,
  createCategory,
  getCategoryDetails,
  editCategory,
  deleteCategory,
} = require("../controllers/Category");
const {
  createSection,
  updateSection,
  deleteSection,
  getAllSections,
} = require("../controllers/Section");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");
const {
  createRatingAndReview,
  getAverageRating,
  getAllRatingReview,
  editRating,
  deleteRating,
} = require("../controllers/RatingAndReview");

/**
 * #### Course Management Routes
 *
 * Functionality:
 *   - These routes handle the management of courses, including creation, deletion, and modification
 *     of courses, sections, subsections, categories, and ratings/reviews.
 *
 * - Middleware Used:
 *   - auth: Middleware to verify user's credentials.
 *   - isInstructor: Middleware to check if the user is an instructor.
 *   - isStudent: Middleware to check if the user is a student.
 *   - isAdmin: Middleware to check if the user is an admin.
 *
 * - Endpoints:
 *   - Course Routes:
 *     - POST /createCourse: Creates a new course. [Protected, Instructor]
 *     - POST /editCourse: Edits details of an existing course. [Protected, Instructor]
 *     - POST /deleteCourse: Deletes an existing course. [Protected, Instructor]
 *     - GET /getAllCourses: Retrieves details of all courses. [Public]
 *     - POST /getCourseDetails: Retrieves details of a specific course. [Public]
 *
 *   - Section Routes:
 *     - POST /addSection: Adds a new section to a course. [Protected, Instructor]
 *     - POST /updateSection: Updates a section of a course. [Protected, Instructor]
 *     - POST /deleteSection: Deletes a section from a course. [Protected, Instructor]
 *     - GET /getAllSections: Retrieves details of all sections in a course. [Public]
 *
 *   - Sub Section Routes:
 *     - POST /updateSubSection: Updates a subsection of a course. [Protected, Instructor]
 *     - POST /deleteSubSection: Deletes a subsection from a course. [Protected, Instructor]
 *     - POST /addSubSection: Adds a new subsection to a course. [Protected, Instructor]
 *
 *   - Category Routes (Admin Only):
 *     - POST /createCategory: Creates a new category. [Protected, Admin]
 *     - GET /getAllCategories: Retrieves details of all categories. [Protected, Admin]
 *     - POST /getCategoryDetails: Retrieves details of a specific category. [Protected, Admin]
 *     - POST /editCategory: Edits details of an existing category. [Protected, Admin]
 *     - POST /deleteCategory: Deletes an existing category. [Protected, Admin]
 *
 *   - Rating & Review Routes:
 *     - POST /createRatingAndReview: Creates a new rating and review for a course. [Protected, Student]
 *     - GET /getAverageRating: Retrieves the average rating for a course. [Public]
 *     - GET /getReviews: Retrieves all ratings and reviews for a course. [Public]
 *     - POST /editRating: Updates an existing rating and review for a course. [Protected, Student]
 *     - POST /deleteRating: Deletes an existing rating and review for a course. [Protected, Student]
 */

// Course Routes
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.post("/deleteCourse", auth, isInstructor, deleteCourse);

router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseAllDetails);

// Section Routes
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);

router.get("/getAllSections", getAllSections);

// Sub Section Routes
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Category Routes (Admin Only)
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/getAllCategories", auth, isAdmin, getAllCategories);
router.post("/getCategoryDetails", auth, isAdmin, getCategoryDetails);
router.post("/editCategory", auth, isAdmin, editCategory);
router.post("/deleteCategory", auth, isAdmin, deleteCategory);

// Rating & Review Routes
router.post("/createRating", auth, isStudent, createRatingAndReview);
router.post("/editRating", auth, isStudent, editRating);
router.post("/deleteRating", auth, isStudent, deleteRating);

router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;
