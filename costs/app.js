const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const pino = require('pino');
const Logs = require('./models/Logs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Formatting JSON responses for better readability
app.set('json spaces', 2);
app.use(express.json());

const logger = pino();

/*
 * Middleware to log every incoming HTTP request.
 * Captured data is printed to the console and stored in MongoDB.
 */
app.use((req, res, next) => {
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };

    // Log the request to the console using Pino
    logger.info(logEntry);

    // Save the log entry to the database if the connection is active
    if (mongoose.connection.readyState === 1) {
        const newLog = new Logs(logEntry);
        newLog.save().catch(err => console.error("Failed to save log:", err.message));
    }

    next();
});

// Establish connection to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Costs Service: Successfully connected to MongoDB'))
    .catch(err => console.error('Costs Service: MongoDB connection error:', err.message));

// Import and map the costs-related routes
const costsRoutes = require('./routes/costs');
app.use('/api', costsRoutes);

// Set the service port (defaults to 3003)
const PORT = process.env.PORT_COSTS || 3003;

app.listen(PORT, () => {
    console.log(`Costs Service is running on port ${PORT}`);
});

module.exports = app;