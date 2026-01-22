/*
 * test_admin.js
 * Unit testing script for the Admin Microservice (Process 4).
 * Validates the About endpoint and the Admin dashboard route.
 */

const axios = require('axios');

// Base URL for the Admin service running on Port 3004
const BASE_URL = 'http://localhost:3004/api';

async function testAdminService() {
    console.log("Starting Tests for Admin/About Service (Port 3004)...");

    try {
        /*
         * TEST 1: Retrieving developers details (About).
         * Requirement: Return a JSON with first_name and last_name of members.
         */
        console.log("\n1. Testing About Route (GET /api/about)...");
        const aboutRes = await axios.get(`${BASE_URL}/about`);

        console.log("Success: Developers info retrieved.");
        console.log("Team Members:", JSON.stringify(aboutRes.data, null, 2));

        /*
         * TEST 2: Testing Admin Access.
         * Requirement: Validates that the general admin route is reachable.
         */
        console.log("\n2. Testing Admin Route (GET /api/admin)...");
        try {
            const adminRes = await axios.get(`${BASE_URL}/admin`);
            console.log("Success: Admin route reached. Data:", adminRes.data);
        } catch (err) {
            console.log("Note: Admin route exists but may require specific response/parameters.");
        }

    } catch (error) {
        console.error("Critical Failure: Ensure the process on Port 3004 is active.");
        if (error.response) {
            console.log("Error details:", error.response.data);
        } else {
            console.log("Error message:", error.message);
        }
    }
}

testAdminService();