// Import dependencies
const Razorpay = require("razorpay"); // Library to import razorpay payment

/**
 * #### Razorpay Instance
 *
 * Functionality:
 *   - This function creates an instance of the Razorpay client with the provided API key and secret.
 *     It initializes the Razorpay client with the necessary credentials required for making payments.
 *
 * - Environment Variables Required:
 *   - RAZORPAY_KEY: The API key provided by Razorpay.
 *   - RAZORPAY_SECRET: The API secret provided by Razorpay.
 *
 * @returns {Razorpay} - Returns a new instance of the Razorpay client.
 */
exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
