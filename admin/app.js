const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const pino = require('pino');

// Importing the Logs model for database operations
const Logs = require('./models/Logs');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Initialize Pino logger for console logging
const logger = pino();

// Middleware to log every incoming HTTP request and save it to MongoDB
app.use((req, res, next) => {
    // Create an object containing the request metadata
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };

    // Output the log entry to the console
    logger.info(logEntry);

    // Create a new instance of the Logs model and save it to the database
    const newLog = new Logs(logEntry);

    // Attempting to save to the database; errors are caught and logged to console
    newLog.save().catch(err => console.error("Failed to save log to DB:", err));

    // Proceed to the next middleware or route handler
    next();
});

// Establish a connection to the MongoDB Atlas cluster
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Admin Service connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import the about and logs route handlers
const aboutRoutes = require('./routes/about');
const logsRoutes = require('./routes/logs');

// Map the routes to the /api endpoint prefix
app.use('/api', aboutRoutes);
app.use('/api', logsRoutes);

// Define the server port and start listening for requests
const PORT = process.env.PORT_3004 || 3004;

app.listen(PORT, () => {
    // Confirm that the server is successfully running
    console.log(`Admin Service is running on port ${PORT}`);
});