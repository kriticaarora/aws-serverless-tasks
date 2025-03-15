const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Fetch table name from environment variable
const table_name = process.env.tablename;


exports.handler = async (event) => {
    console.log("Incoming Event:", JSON.stringify(event, null, 2));

    try {
        // Parse request body
        let requestBody;
        try {
            requestBody = JSON.parse(event.body);
        } catch (error) {
            console.error("Error parsing request body:", error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON format in request body." }),
            };
        }

        // Validate required fields
        if (!requestBody.principalId || !requestBody.content || typeof requestBody.content !== "object") {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Invalid request: 'principalId' must be present and 'content' must be a JSON object.",
                }),
            };
        }

        // Ensure principalId is a string (to avoid type issues)
        const principalId = String(requestBody.principalId);

        // Create new event object
        const newEvent = {
            id: uuidv4(),
            principalId: principalId,
            createdAt: new Date().toISOString(),
            body: requestBody.content, // Ensure content is stored as an object, not a string
        };

        console.log("Event Object to be Inserted:", JSON.stringify(newEvent, null, 2));

        // Save event to DynamoDB
        await dynamoDB.put({
            TableName: table_name,
            Item: newEvent,
        }).promise();

        console.log("DynamoDB Insert Successful");

        // Success response
        return {
            statusCode: 201,  
            body: JSON.stringify({ message: "Event created successfully", event: newEvent }),
        };

    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error", details: error.message }),
        };
    }
};
