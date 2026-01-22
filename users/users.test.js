/*
 * test_users.js
 * Unit testing script for the Users Microservice (Process 2).
 * Updated to match the root routing structure.
 */

const axios = require('axios');

// Base URL for the Users service
const BASE_URL = 'http://localhost:3002/api';

async function testUsersService() {
    console.log("Starting Users Service Validation...");

    try {
        /*
         * TEST 1: Adding a new user.
         * Requirement: The database must contain 'mosh israeli' (ID: 123123).
         */
        console.log("\n1. Testing User Addition (POST /api/add)...");
        const newUser = {
            id: 123123,
            first_name: "mosh",
            last_name: "israeli",
            birthday: "1990-01-10"
        };
        try {
            const addRes = await axios.post(`${BASE_URL}/add`, newUser);
            console.log("Success: User added.", addRes.data);
        } catch (error) {
            if (error.response && error.response.data.id === "exists") {
                console.log("Note: User 123123 already exists.");
            } else {
                throw error;
            }
        }

        /*
         * TEST 2: Getting details of a specific user.
         * Matches: GET /api/users/123123
         */
        console.log("\n2. Testing Specific User Retrieval (GET /api/users/123123)...");
        const detailsRes = await axios.get(`${BASE_URL}/users/123123`);
        console.log("Success: Details retrieved:", detailsRes.data);

        /*
         * TEST 3: Retrieving the full list of users.
         * Updated: Matches GET /api/ based on your current router.get('/')
         */
        console.log("\n3. Testing Full Users List (GET /api/)...");
        const listRes = await axios.get(`${BASE_URL}/`);
        console.log(`Success: Found ${listRes.data.length} users in the database.`);

    } catch (error) {
        console.error("Critical Failure: Check if Port 3002 is active.");
        if (error.response) {
            console.log("Error details:", error.response.data);
        } else {
            console.log("Error message:", error.message);
        }
    }
}

testUsersService();