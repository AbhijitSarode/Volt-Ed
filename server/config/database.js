// Import Dependencies
const mongooose = require("mongoose");
require("dotenv").config();

/**
 * #### Connect to Database
 *
 * Functionality:
 *   - This function establishes a connection to the MongoDB database using Mongoose.
 *     It reads the MongoDB connection URL from the environment variables.
 *
 * - Environment Variables Required:
 *   - MONGO_URL: The URL of the MongoDB database.
 *
 * @returns {void} - This function does not return anything.
 */
const connectDB = () => {
  mongooose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.info("SUCCESS: Connected to database");
    })
    .catch((error) => {
      console.info("FAILED: Unable to connect to database");
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = connectDB;
