// Import dependencies
const express = require("express"); // Import express framework
const dotenv = require("dotenv").config(); // Load env variables
const cors = require("cors"); // Library to enable CORS

// Import service connection files
const connectDB = require("./config/database"); // Import database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middlewares
app.use(express.json()); // Parse incoming json request
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enables cors for requests from localhost

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
