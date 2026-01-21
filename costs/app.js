const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
const pino = require('pino');


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

    // To save to MongoDB, you can use your Log model
    // Assuming you have a Log model imported as 'Log'
    const Log = require('./models/logs');
    const newLog = new Log(logEntry);
    newLog.save().catch(err => console.error("Failed to save log:", err));

    next();
});
mongoose.connect(process.env.MONGODB_URI);

const routes = require('./routes/costs'); // users, costs, etc.
app.use('/api', routes);

const PORT = process.env.PORT_COSTS || 3003;

app.listen(PORT, () => {
    console.log(`Costs Service is running on port ${PORT}`);
});