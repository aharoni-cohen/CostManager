const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const pino = require('pino');
const Log = require('./models/logs');

// 1. Load environment variables from the parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(express.json());

const logger = pino();

// 2. Middleware to log every incoming HTTP request
app.use((req, res, next) => {
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };

    logger.info(logEntry);

    // Dynamic import of Log model to save request data to MongoDB

    const newLog = new Log(logEntry);

    // Only attempt to save logs if the database connection is active (readyState 1)
    newLog.save().catch(err => {
        if (mongoose.connection.readyState === 1) {
            console.error("Failed to save log:", err.message);
        }
    });

    next();
});

// 3. Establish connection to MongoDB Atlas using URI from .env
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('MongoDB connection error details:', err.message);
    });

// 4. Import the Users router
const usersRouter = require('./routes/users');

// 5. Route Mapping
// Map /api/users to handle user listing and specific user details
app.use('/api/users', usersRouter);
// Map /api to handle specific endpoints like /api/add defined in the router
app.use('/api', usersRouter);

// 6. Start the server on the specified port
const PORT = process.env.PORT_USERS || 3002;
app.listen(PORT, () => {
    console.log(`Users Service is running on port ${PORT}`);
});

// Export the app instance for Unit Testing purposes
module.exports = app;