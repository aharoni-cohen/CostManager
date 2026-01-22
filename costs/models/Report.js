const mongoose = require('mongoose');

/*
 * Report Schema for Computed Design Pattern.
 * Stores pre-calculated monthly reports to avoid re-computing past data.
 */
const reportSchema = new mongoose.Schema({
    // The user ID associated with the report
    userid: { type: Number, required: true },
    // The specific year of the report
    year: { type: Number, required: true },
    // The specific month of the report
    month: { type: Number, required: true },
    // This field stores the final structured JSON of costs grouped by categories
    data: { type: Object, required: true }
});

// Indexing for fast retrieval and to prevent duplicate reports for the same period
reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

const Reports = mongoose.model('Reports', reportSchema, 'reports');

module.exports = Reports;