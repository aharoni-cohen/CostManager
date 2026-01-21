const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const pino = require('pino');
const Logs = require('./models/Logs');

// Load configuration from the root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(express.json());

const logger = pino();

// Middleware to log every incoming HTTP request to MongoDB
app.use((req, res, next) => {
    // Define the log metadata
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };

    // Log the request to the console using Pino
    logger.info(logEntry);

    // [Constraint Check] Ensure DB connection is active before saving
    if (mongoose.connection.readyState === 1) {
        const newLog = new Logs(logEntry);
        newLog.save().catch(err => console.error("Failed to save log:", err.message));
    }

    next();
});

// Establish connection to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Logs Service: Successfully connected to MongoDB'))
    .catch(err => console.error('Logs Service: MongoDB connection error:', err));

// Import and use the logs routes
const logsRoutes = require('./routes/logs');
app.use('/api', logsRoutes);

// Set the port from environment variables or default to 3001
const PORT = process.env.PORT_LOGS || 3001;
app.listen(PORT, () => console.log(`Logs Service Running on port ${PORT}`));

module.exports = app;