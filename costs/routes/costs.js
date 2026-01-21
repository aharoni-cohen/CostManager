const express = require('express');
const router = express.Router();
const Cost = require('../models/costs');
const Report = require('../models/report');
const User = require('../models/users');
const logger = require('pino')();

/*
 * GET /api/report
 * Implements the Computed Design Pattern.
 * Logic:
 * 1. Checks if the requested report is for a past month.
 * 2. If it is a past month, checks the 'reports' collection for a cached version.
 * 3. If no cache exists (or it's the current month), calculates data from the 'costs' collection.
 * 4. Saves the calculated report to the cache only if it represents a past month.
 */
router.get('/report', async (req, res, next) => {
    try {
        const id = parseInt(req.query.id);
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        if (!id || !year || !month) {
            return res.status(400).json({
                id: "validation_error",
                message: "User ID, year, and month are required."
            });
        }

        // Determine if the requested date is in the past
        const now = new Date();
        const isPast = (year < now.getFullYear()) ||
            (year === now.getFullYear() && month < (now.getMonth() + 1));

        // 1. Check if the report already exists (Cache Hit)
        // This only applies to past reports, as current month reports change dynamically.
        if (isPast) {
            const existingReport = await Report.findOne({ userid: id, year: year, month: month });

            if (existingReport) {
                logger.info({ endpoint: '/api/report', method: 'GET', status: 'cache_hit' });
                // Note: Using 'data' field as defined in the Report model
                return res.json({
                    userid: existingReport.userid,
                    year: existingReport.year,
                    month: existingReport.month,
                    costs: existingReport.data
                });
            }
        }

        // 2. Fetch costs for specific month/year if report doesn't exist
        // Using 'created_at' to match the Cost model definition
        const costs = await Cost.find({
            userid: id,
            created_at: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });

        // 3. Structure data by categories as requested
        const categories = ["food", "health", "housing", "sports", "education"];
        const groupedCosts = categories.map(cat => {
            const categoryObj = {};
            categoryObj[cat] = costs
                .filter(c => c.category === cat)
                .map(c => ({
                    sum: c.sum,
                    description: c.description,
                    day: new Date(c.created_at).getDate()
                }));
            return categoryObj;
        });

        // 4. Save the newly computed report ONLY if it is a past month
        if (isPast) {
            const newReport = new Report({
                userid: id,
                year: year,
                month: month,
                data: groupedCosts // Saving to 'data' field
            });

            await newReport.save();
            logger.info({ endpoint: '/api/report', method: 'GET', status: 'computed_and_saved' });
        }

        res.json({
            userid: id,
            year: year,
            month: month,
            costs: groupedCosts
        });

    } catch (err) {
        logger.error(err);
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

/*
 * POST /api/add
 * Validates user existence before adding cost item.
 */
router.post('/add', async (req, res, next) => {
    try {
        const { userid, description, category, sum } = req.body;

        if (!userid || !description || !category || !sum) {
            return res.status(400).json({ id: "missing_fields", message: "All fields are required" });
        }

        // Validate user existence (Requirement Q&A 11)
        const userExists = await User.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json({ id: "user_not_found", message: "User ID does not exist" });
        }

        const newCost = new Cost({
            userid: parseInt(userid),
            description,
            category,
            sum: parseFloat(sum),
            // Use provided date or default to now. Maps to 'created_at' in model.
            created_at: req.body.date ? new Date(req.body.date) : new Date()
        });

        const savedCost = await newCost.save();
        logger.info({ endpoint: '/api/add', method: 'POST', status: 'success' });

        res.json(savedCost);

    } catch (err) {
        logger.error(err);
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

module.exports = router;