const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * User Schema Definition
 * Defines the structure of the user document in MongoDB.
 */
const userSchema = new Schema({
    // Custom ID (Logic ID, different from MongoDB's _id)
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

// Create the model and export it
// This will map to the 'users' collection in MongoDB

module.exports =  mongoose.model('User', userSchema);;