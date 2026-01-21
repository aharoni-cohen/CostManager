const express = require('express');
const router = express.Router();
const Log = require('../models/logs'); // Ensure this points to your logs model

/*
 * GET /api/logs
 * This endpoint allows the administrator to retrieve all system logs
 * stored in the MongoDB database.
 */
router.get('/logs', async (req, res, next) => {
    try {
        // Fetching all logs from the collection
        const logs = await Log.find();
        res.json(logs);
    } catch (err) {
        // According to requirements, errors must include id and message
        res.status(500).json({
            id: "server_error",
            message: "Failed to retrieve logs: " + err.message
        });
    }
});

module.exports = router;