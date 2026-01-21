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
            { first_name: "Eden", last_name: "Charkachi" },
            { first_name: "Aharoni", last_name: "Cohen" }
        ];
        res.json(team);
    } catch (err) {
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

module.exports = router;

