/*
 * costs/routes/costs.js
 * This router handles cost additions and monthly reports (Process 3).
 * It implements the Computed Design Pattern for past months.
 */

const express = require('express');
const router = express.Router();
const Cost = require('../models/costs');
const Report = require('../models/Report');
const Users = require('../models/users');

/*
 * GET /api/report
 * Returns a monthly report grouped by categories.
 * COMPUTED DESIGN PATTERN:
 * If a report for a past month is requested, the system checks the
 * 'reports' collection. If it exists, it is returned.
 * If not, it is computed, returned, and then saved.
 */
router.get('/report', async (req, res) => {
    try {
        const id = req.query.id;
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        if (!id || !year || !month) {
            return res.status(400).json({
                id: "validation_error",
                message: "User ID, year, and month are required."
            });
        }

        const now = new Date();
        const isPast = (year < now.getFullYear()) || (year === now.getFullYear() && month < (now.getMonth() + 1));

        if (isPast) {
            const existingReport = await Report.findOne({ userid: id, year: year, month: month });
            if (existingReport) {
                return res.status(200).json({
                    userid: existingReport.userid,
                    year: existingReport.year,
                    month: existingReport.month,
                    costs: existingReport.data
                });
            }
        }

        const costs = await Cost.find({
            userid: id,
            created_at: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });

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

        if (isPast) {
            const newReport = new Report({
                userid: id,
                year: year,
                month: month,
                data: groupedCosts
            });
            await newReport.save();
        }

        res.status(200).json({
            userid: id,
            year: year,
            month: month,
            costs: groupedCosts
        });

    } catch (err) {
        res.status(500).json({ id: "server_error", message: err.message });
    }
});

/*
 * POST /api/add
 * Adds a new cost item to the database.
 */
router.post('/add', async (req, res) => {
    try {
        const { userid, description, category, sum } = req.body;

        if (!userid || !description || !category || !sum) {
            return res.status(400).json({ id: "missing_fields", message: "All fields are required" });
        }

        const userExists = await Users.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json({ id: "user_not_found", message: "User ID does not exist" });
        }

        const newCost = new Cost({
            userid: userid, // Must be a Number
            description,
            category,
            sum: parseFloat(sum),
            created_at: req.body.date ? new Date(req.body.date) : new Date()
        });

        const savedCost = await newCost.save();
        res.status(201).json(savedCost);

    } catch (err) {
        res.status(500).json({ id: "add_cost_error", message: err.message });
    }
});

module.exports = router;