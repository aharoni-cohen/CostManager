const express = require('express');
const router = express.Router();

/*
 * GET /api/about
 * Returns the first and last names of the development team members.
 * This information is hardcoded as per requirements.
 */
router.get('/about', (req, res) => {
    try {
        const team = [
            { first_name: process.env.DEV1_FIRST, last_name: process.env.DEV1_LAST },
            { first_name: process.env.DEV2_FIRST, last_name: process.env.DEV2_LAST }
        ];
        res.json(team);
    } catch (err) {
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

module.exports = router;

