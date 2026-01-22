const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const pino = require('pino');
const Logs = require('./models/Logs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const logger = pino();

// 1. Basic configuration
app.use(express.json());

// 2. Logging Middleware - MUST come before routes
app.use((req, res, next) => {
    const logEntry = {
        method: req.method,
        url: req.url,
        timestamp: new Date()
    };
    logger.info(logEntry);

    if (mongoose.connection.readyState === 1) {
        const newLog = new Logs(logEntry);
        newLog.save().catch(err => console.error("Failed to save log to DB:", err));
    }
    next();
});

// 3. Routes - Connected to /api
const aboutRoutes = require('./routes/about');
const logsRoutes = require('./routes/logs');

app.use('/api', aboutRoutes);
app.use('/api', logsRoutes);

// 4. Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Admin Service connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 5. Server Port
const PORT = process.env.PORT_ABOUT || 3004; // שימוש בפורט 3004 כפי שהגדרת

app.listen(PORT, () => {
    console.log(`Admin Service is running on port ${PORT}`);
});