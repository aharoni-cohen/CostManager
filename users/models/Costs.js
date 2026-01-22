const mongoose = require('mongoose');

/*
 * Cost Schema definition.
 * This schema defines the structure for individual cost items
 * associated with specific users.
 */
const costsSchema = new mongoose.Schema({
    // Reference to the user ID who owns this cost
    userid: {
        type: Number,
        required: true
    },
    // Brief description of the expense
    description: {
        type: String,
        required: true
    },
    // Category classification for the expense with predefined options
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sports', 'education']
    },
    // The monetary value of the cost item
    sum: {
        type: Number,
        required: true
    },
    // Automatic timestamp for when the record was created
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create and export the model using the defined schema.
// We name the model 'Costs' and point it to the 'costs' collection.
const Costs = mongoose.model('Costs', costsSchema, 'costs');

module.exports = Costs;