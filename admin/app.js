const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const pino = require('pino');

// 1. Load configuration
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(express.json());
const logger = pino();

// 2. Middleware to log every incoming request to MongoDB
app.use((req, res, next) => {
    /* * Requirement: Log every HTTP request received.
     * We record the method, URL, and current timestamp.
     */
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };

    // Log to console using Pino
    logger.info(logEntry);

    // Save log entry to MongoDB
    try {
        const Log = require('./models/logs');
        const newLog = new Log(logEntry);
        newLog.save().catch(err => console.error("Failed to save log to DB:", err));
    } catch (error) {
        console.error("Error loading Log model:", error.message);
    }
    next();
});

// 3. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Admin Service connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 4. Import and Use Routes
// The Admin service handles both 'about' and 'logs'
const aboutRoutes = require('./routes/about');
const logsRoutes = require('./routes/logs');

app.use('/api', aboutRoutes);
app.use('/api', logsRoutes);

// 5. Start the server
const PORT = process.env.PORT_3004 || 3004;
app.listen(PORT, () => {
    console.log(`Admin Service is running on port ${PORT}`);
});