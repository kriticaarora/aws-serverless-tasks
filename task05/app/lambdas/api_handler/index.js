const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Fetch table name from environment variable
const table_name = process.env.target_table;

exports.handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event));

        // Parse request body
        let requestBody;
        try {
            requestBody = JSON.parse(event.body);
        } catch (error) {
            console.error("Error parsing request body:", error);
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Invalid JSON format in request body." }),
            };
        }

        // Validate required fields
        if (!requestBody.principalId || typeof requestBody.content !== "object") {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "'principalId' (number) and 'content' (object) are required." }),
            };
        }

        // Create new event object
        const newEvent = {
            id: uuidv4(),
            principalId: requestBody.principalId,
            createdAt: new Date().toISOString(),
            body: requestBody.content
        };

        // Save event to DynamoDB
        await dynamoDB.put({
            TableName: table_name,
            Item: newEvent
        }).promise();

        console.log("Successfully stored event:", JSON.stringify(newEvent));

        // Success response
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Event stored successfully", event: newEvent }),
        };

    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
