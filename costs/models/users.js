const mongoose = require('mongoose');
/*
 * User Schema definition.
 * This schema maps to the 'users' collection in MongoDB.
 */
const usersSchema = new mongoose.Schema({
    // The user's unique identifier (Number). This is different from MongoDB's _id.
    id: {
        type: Number,
        required: true,
        unique: true
    },
    // The user's first name.
    first_name: {
        type: String,
        required: true
    },
    // The user's last name.
    last_name: {
        type: String,
        required: true
    },
    // The user's date of birth.
    birthday: {
        type: Date,
        required: true
    }
});

// Exporting the model and explicitly naming the collection 'users'.
module.exports = mongoose.model('User', usersSchema, 'users');