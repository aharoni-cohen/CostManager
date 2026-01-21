const mongoose = require('mongoose');

/*
 * Cost Schema definition.
 * Used for tracking individual cost items for users.
 */
const costsSchema = new mongoose.Schema({
    // The ID of the user who owns this cost item.
    userid: {
        type: Number,
        required: true
    },
    // Description of the item purchased.
    description: {
        type: String,
        required: true
    },
    // The category must be one of the specified allowed values.
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sports', 'education']
    },
    // The cost amount. Mongoose 'Number' supports double precision.
    sum: {
        type: Number,
        required: true
    },
    // Date when the cost was created. Defaults to the current time if not provided.
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exporting the model and explicitly naming the collection 'costs'.
module.exports = mongoose.model('Cost', costsSchema, 'costs');