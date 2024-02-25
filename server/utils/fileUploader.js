/**
 * #### File Uploader
 *
 * **Functionality:**
 * - This function uploads a file to Cloudinary with optional compression.
 *
 * **Input:**
 * - Expects a file object, destination folder, and optional height and quality parameters.
 *
 * **Options:**
 * - folder: The destination folder on Cloudinary.
 * - height: Optional parameter for image height.
 * - quality: Optional parameter for image quality.
 * - resource_type: Set to "auto" to accept any file format.
 *
 * **Returns:**
 * - Cloudinary upload response containing information about the uploaded file.
 *
 * @param {Object} file - The file object to be uploaded.
 * @param {string} folder - The destination folder on Cloudinary.
 * @param {number} [height] - Optional parameter for image height.
 * @param {number} [quality] - Optional parameter for image quality.
 * @returns {Object} - Returns a response containing information about the uploaded file.
 */
exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
  try {
    // Set upload options
    let options = {
      folder: folder,
      resource_type: "auto",
    };
    if (height) options.height = height;
    if (quality) options.quality = quality;

    // Upload file to Cloudinary
    return (response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    ));
  } catch (err) {
    console.error(err);
  }
};
