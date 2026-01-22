const express = require('express');
const router = express.Router();
const path = require('path');
const dotenv = require('dotenv');

// Loading the .env from the root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

/*
 * GET /api/about
 * Returns the names from environment variables.
 */
router.get('/about', (req, res) => { // שונה ל- /about כדי להתחבר נכון ל- /api ב-app.js
    try {
        const team = [
            {
                first_name: process.env.DEV1_FIRST_NAME,
                last_name: process.env.DEV1_LAST_NAME
            },
            {
                first_name: process.env.DEV2_FIRST_NAME,
                last_name: process.env.DEV2_LAST_NAME
            }
        ];
        res.status(200).json(team);
    } catch (err) {
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

module.exports = router;