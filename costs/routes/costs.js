const express = require('express');
const router = express.Router();
const Cost = require('../models/costs');
// Import required models and logger
const Report = require('../models/report');
const User = require('../models/users');
const logger = require('pino')();

/*
 * GET /api/report
 * Retrieves monthly report. Uses Computed Pattern: checks cache for past months,
 * otherwise calculates data from raw costs and caches the result if applicable.
 */
router.get('/report', async (req, res, next) => {
    try {
        const id = parseInt(req.query.id);
        const year = parseInt(req.query.year);
        // Parse the month parameter to ensure it is an integer
        const month = parseInt(req.query.month);

        if (!id || !year || !month) {
            return res.status(400).json({
                id: "validation_error",
                message: "User ID, year, and month are required."
            });
        }

        // Determine if the requested date represents a past month
        const now = new Date();
        const isPast = (year < now.getFullYear()) ||
            (year === now.getFullYear() && month < (now.getMonth() + 1));

        if (isPast) {
            // Check the database for an existing cached report
            const existingReport = await Report.findOne({ userid: id, year: year, month: month });

            if (existingReport) {
                logger.info({ endpoint: '/api/report', method: 'GET', status: 'cache_hit' });
                return res.json({
                    userid: existingReport.userid,
                    year: existingReport.year,
                    // Return the cached data structure directly
                    month: existingReport.month,
                    costs: existingReport.data
                });
            }
        }

        // Fetch raw cost documents from the collection for the specific range
        const costs = await Cost.find({
            userid: id,
            created_at: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });

        // Define the required categories for the report structure
        const categories = ["food", "health", "housing", "sports", "education"];
        const groupedCosts = categories.map(cat => {
            const categoryObj = {};
            categoryObj[cat] = costs
                // Filter and map costs to the simplified object format
                .filter(c => c.category === cat)
                .map(c => ({
                    sum: c.sum,
                    description: c.description,
                    day: new Date(c.created_at).getDate()
                }));
            return categoryObj;
        });

        if (isPast) {
            // Save the newly computed report to the cache for future use
            const newReport = new Report({
                userid: id,
                year: year,
                month: month,
                data: groupedCosts
            });

            await newReport.save();
            logger.info({ endpoint: '/api/report', method: 'GET', status: 'computed_and_saved' });
        }

        // Send the final JSON response with the grouped costs
        res.json({
            userid: id,
            year: year,
            month: month,
            costs: groupedCosts
        });

    } catch (err) {
        // Log the error and return a server error status
        logger.error(err);
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

/*
 * POST /api/add
 * Adds a new cost item. Validates that all fields are present and
 * checks if the user exists in the database before saving.
 */
router.post('/add', async (req, res, next) => {
    try {
        const { userid, description, category, sum } = req.body;

        // Ensure all required fields are present in the request body
        if (!userid || !description || !category || !sum) {
            return res.status(400).json({ id: "missing_fields", message: "All fields are required" });
        }

        // Query the Users collection to verify that the user exists
        const userExists = await User.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json({ id: "user_not_found", message: "User ID does not exist" });
        }

        const newCost = new Cost({
            userid: parseInt(userid),
            description,
            // Assign the category and ensure sum is a float
            category,
            sum: parseFloat(sum),
            created_at: req.body.date ? new Date(req.body.date) : new Date()
        });

        // Save the new cost item to the database
        const savedCost = await newCost.save();
        logger.info({ endpoint: '/api/add', method: 'POST', status: 'success' });

        res.json(savedCost);

    } catch (err) {
        // Handle any errors during the save process
        logger.error(err);
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

module.exports = router;