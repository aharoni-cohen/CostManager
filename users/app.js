const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const pino = require('pino');

// Importing the Logs model for request tracking
const Logs = require('./models/Logs');

// Load environment variables from the configuration file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Initialize the Pino logger for server console output
const logger = pino();

// Middleware to capture and log every incoming HTTP request to MongoDB
app.use((req, res, next) => {
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };

    // Output log data to the console
    logger.info(logEntry);

    // Create a new log instance and save it if the database connection is ready
    if (mongoose.connection.readyState === 1) {
        const newLog = new Logs(logEntry);
        newLog.save().catch(err => console.error("Failed to save log:", err.message));
    }

    next();
});

// Establish a connection to the remote MongoDB Atlas cluster
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Users Service: Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

// Import the user-related route handlers
const usersRouter = require('./routes/users');

// Map the router to the /api prefix to handle user operations
app.use('/api', usersRouter);

// Define the service port and start the server
const PORT = process.env.PORT_USERS || 3002;

app.listen(PORT, () => {
    console.log(`Users Service is running on port ${PORT}`);
});

// Export the application instance for testing and modularity
module.exports = app;