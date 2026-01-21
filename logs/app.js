const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const pino = require('pino');
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(express.json());
const logger = pino();

// Middleware to log every incoming request
app.use((req, res, next) => {
    /* * Requirement: Log every HTTP request received.
     * We log the method, URL, and timestamp.
     */
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };

    // Log to console (Pino)
    logger.info(logEntry);

    // Attempt to save the log entry to MongoDB
    try {
        const Log = require('./models/logs');
        const newLog = new Log(logEntry);

        // Save only if the database connection is active (readyState 1)
        if (mongoose.connection.readyState === 1) {
            newLog.save().catch(err => console.error("Failed to save log:", err.message));
        }
    } catch (error) {
        console.error("Log model error:", error.message);
    }
});

// Connect to MongoDB Atlas using the URI from .env
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Logs Service: Successfully connected to MongoDB'))
    .catch(err => console.error('Logs Service: MongoDB connection error:', err));

// Load the Logs router.
const routes = require('./routes/logs');
app.use('/api', routes);

const PORT = process.env.PORT_LOGS || 3001;
app.listen(PORT, () => console.log(`Logs Service Running on port ${PORT}`));

module.exports = app;