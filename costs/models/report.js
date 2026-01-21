const mongoose = require('mongoose');

/*
 * Report Schema for Computed Design Pattern.
 * Stores pre-calculated monthly reports to avoid re-computing past data.
 */
const reportSchema = new mongoose.Schema({
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    // This field stores the final structured JSON of costs grouped by categories
    data: { type: Object, required: true }
});

// Indexing for fast retrieval
reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema, 'reports');