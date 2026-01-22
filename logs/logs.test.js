/*
 * test_logs.js
 * Unit testing script for the Logs Microservice (Process 1).
 * Validates that system activity is correctly recorded and retrievable.
 */

const axios = require('axios');

// Base URL for the Logs service running on Port 3001
const BASE_URL = 'http://localhost:3001/api';

async function testLogsService() {
    console.log("Starting Tests for Logs Service (Port 3001)...");

    try {
        /*
         * TEST 1: Retrieve all system logs.
         * Requirement: Return a JSON describing all captured HTTP requests.
         */
        console.log("\n1. Testing Logs Retrieval (GET /api/logs)...");
        const logsRes = await axios.get(`${BASE_URL}/logs`);

        console.log("Success: Logs retrieved.");
        console.log(`Total log entries found: ${logsRes.data.length}`);

        // Show the most recent log entry (the last one in the array)
        if (logsRes.data.length > 0) {
            const latestLog = logsRes.data[logsRes.data.length - 1];
            console.log("Latest Log Entry Captured:", JSON.stringify(latestLog, null, 2));
        }

    } catch (error) {
        console.error("Critical Failure: Ensure Port 3001 is active.");
        if (error.response) {
            console.log("Error details:", error.response.data);
        } else {
            console.log("Error message:", error.message);
        }
    }
}

testLogsService();