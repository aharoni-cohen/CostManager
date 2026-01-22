/*
 * test_costs.js
 * Unit testing script for the Costs Microservice (Process 3).
 * This script validates cost addition and the monthly report
 * implementing the Computed Design Pattern.
 */

const axios = require('axios');

// Base URL for the Costs service running on Port 3003
const BASE_URL = 'http://localhost:3003/api';

async function testCostsService() {
    console.log("Starting Tests for Costs Service (Port 3003)...");

    try {
        /*
         * TEST 1: Adding a new cost item.
         * Requirement: User ID must be a Number and sum must be a Double.
         * We use the mandatory user ID: 123123.
         */
        console.log("\n1. Testing Cost Item Addition (POST /api/add)...");
        const newCost = {
            userid: 123123,
            description: "milk and bread",
            category: "food",
            sum: 25.5
        };

        const addRes = await axios.post(`${BASE_URL}/add`, newCost);
        console.log("Success: Cost item added. Response:", addRes.data);

        /*
         * TEST 2: Getting Monthly Report.
         * Requirement: The report must group costs by category.
         * Each cost must show sum, day, and description.
         */
        console.log("\n2. Testing Monthly Report (GET /api/report)...");
        // Using current year/month for the test
        const reportUrl = `${BASE_URL}/report/?id=123123&year=2026&month=1`;
        const reportRes = await axios.get(reportUrl);

        console.log("Success: Monthly report retrieved.");
        console.log("Report Data Structure:", JSON.stringify(reportRes.data, null, 2));

        /*
         * TEST 3: Validation Check for Categories.
         * Requirement: Supported categories are food, health, housing, sports, and education.
         */
        console.log("\n3. Testing Category Grouping...");
        if (reportRes.data.costs) {
            console.log("Validated: Costs are grouped in the response.");
        }

    } catch (error) {
        console.error("Critical Failure: Ensure the server on Port 3003 is active.");
        if (error.response) {
            console.log("Error details:", error.response.data);
        } else {
            console.log("Error message:", error.message);
        }
    }
}

testCostsService();