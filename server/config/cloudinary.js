// Import dependencies
const cloudinary = require("cloudinary").v2; // Library for uploading files to cloudinary media server
const dotenv = require("dotenv").config(); // Load environment variables

/**
 * #### Connect to Cloudinary
 *
 * Functionality:
 *   - This function configures the Cloudinary connection using the provided environment variables.
 *     It sets up the necessary credentials required to authenticate with the Cloudinary service.
 *
 * - Environment Variables Required:
 *   - CLOUD_NAME: The name of your Cloudinary cloud.
 *   - API_KEY: The API key provided by Cloudinary.
 *   - API_SECRET: The API secret provided by Cloudinary.
 *
 * @returns {void} - This function does not return anything.
 */
exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.error(error.message);
  }
};
