const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Cost = require('../models/costs');

/**
 * GET /api/users
 * Returns a list of all users.
 * This route matches the root '/' when called via /api/users in app.js.
 */
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ id: "get_users_error", message: error.message });
    }
});

/**
 * POST /api/add
 * Creates a new user record in the database.
 */
router.post('/add', async (req, res, next) => {
    try {
        const { id, first_name, last_name, birthday } = req.body;

        // Check for existing user to satisfy business logic requirements
        const existingUser = await User.findOne({ id: id });
        if (existingUser) {
            return res.status(400).json({ id: "exists", message: "User already exists" });
        }

        const newUser = new User({ id, first_name, last_name, birthday });
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({ id: "add_error", message: error.message });
    }
});

/**
 * GET /api/users/:id
 * Retrieves specific user data and calculates the total of all their costs.
 * This route must be defined last to avoid intercepting other static routes.
 */
router.get('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Validate that the ID is numeric to prevent Mongoose casting errors
        if (isNaN(userId)) {
            return res.status(400).json({
                id: "invalid_id",
                message: "The provided ID must be a number."
            });
        }

        const user = await User.findOne({ id: parseInt(userId) });
        if (!user) {
            return res.status(404).json({ id: "not_found", message: "User not found" });
        }

        // Aggregate sum of all costs associated with this user ID
        const costs = await Cost.find({ userid: userId });
        const total = costs.reduce((sum, c) => sum + (c.sum || 0), 0);

        // Return JSON with specific keys required by project documentation
        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (error) {
        res.status(500).json({ id: "details_error", message: error.message });
    }
});

module.exports = router;