// Import dependencies
const express = require("express"); // Import express framework
const dotenv = require("dotenv").config(); // Load env variables
const cors = require("cors"); // Library to enable CORS
const fileUpload = require("express-fileupload"); // Library to handle file uploads
const cookieParser = require("cookie-parser"); // Library to parse cookies

// Import service connection files
const connectDB = require("./config/database"); // Import database connection
const { cloudinaryConnect } = require("./config/cloudinary");

// Import routes
const userRoute = require("./routes/User");
const profileRoute = require("./routes/Profile");
const courseRoute = require("./routes/Course");
const paymentRoute = require("./routes/Payment");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Connect to Cloudinary
cloudinaryConnect();

// Middlewares
app.use(express.json()); // Parse incoming json request
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enables cors for requests from localhost
app.use(cookieParser()); // Parse cookies
app.use(fileUpload({ useTempFiles: true, tempFileDir: "temp" })); // Configure fileuplaoder with temporary file settings

// Adding middleware for handling routes
app.use("/auth", userRoute);
app.use("/profile", profileRoute);
app.use("/course", courseRoute);
app.use("/payment", paymentRoute);

// Home Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is up and running....",
  });
});

// Start Server
app.listen(PORT, () => {
  console.info(`Server started on port ${PORT}`);
});
