const express = require('express');

const router = express.Router();

const Users = require('../models/Users');

const Costs = require('../models/Costs'); // ודא שהמודל קיים בנתיב הזה



/*

* GET /api/users/users/:id

* Retrieves details for a specific user and aggregates their total costs.

* This route matches the requested URL: localhost:3002/api/users/123123

*/

router.get('/users/:id', async (req, res) => {

    try {

        const userId = req.params.id;



// Verify that the provided parameter is a valid number

        if (isNaN(userId)) {

            return res.status(400).json({

                id: "invalid_id",

                message: "The provided ID must be a number."

            });

        }



// Find the user by their custom ID (using parseInt to match numeric ID in DB)

        const user = await Users.findOne({ id: parseInt(userId) });

        if (!user) {

            return res.status(404).json({ id: "not_found", message: "User not found" });

        }



// Find all cost items related to the user's numeric ID

        const userCosts = await Costs.find({ userid: parseInt(userId) });



// Sum up the 'sum' field from all found cost documents

        const total = userCosts.reduce((sum, item) => sum + (item.sum || 0), 0);



// Return a combined object containing user details and the total cost

        res.status(200).json({

            first_name: user.first_name,

            last_name: user.last_name,

            id: user.id,

            total: total

        });

    } catch (error) {

        res.status(500).json({ id: "details_error", message: error.message });

    }

});



/*

* GET /api/users

* Retrieves a full list of users stored in the database.

*/

router.get('/', async (req, res) => {

    try {

        const users = await Users.find({});

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({ id: "get_users_error", message: error.message });

    }

});



/*

* POST /api/users/add

* Validates the request body and creates a new user record.

*/

router.post('/add', async (req, res) => {

    try {

        const { id, first_name, last_name, birthday } = req.body;



        const existingUser = await Users.findOne({ id: id });

        if (existingUser) {

            return res.status(400).json({ id: "exists", message: "User already exists" });

        }



        const newUser = new Users({ id, first_name, last_name, birthday });

        await newUser.save();

        res.status(200).json(newUser);

    } catch (error) {

        res.status(400).json({ id: "add_error", message: error.message });

    }

});



module.exports = router;

