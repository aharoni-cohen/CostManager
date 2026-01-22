const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * User Schema Definition
 * This schema defines the structure of a user document in the database,
 * including their unique identification and personal details.
 */
const userSchema = new Schema({
    // Custom logic ID, separate from MongoDB's internal _id
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
});

// Create the model and export it.
// We use the name 'Users' (Capitalized) to match the filename and requirements.
// The second argument maps this to the 'users' collection in the database.
const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;