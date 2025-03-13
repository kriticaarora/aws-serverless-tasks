const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Fetch table name from environment variable
const TABLE_NAME = process.env.TARGET_TABLE;

exports.handler = async (event) => {
    try {
        // Parse request body
        const requestBody = JSON.parse(event.body);

        // Validate input
        if (!requestBody.principalId || !requestBody.content) {
            return {
                statusCode: 400,
                body: "Invalid request: 'principalId' and 'content' are required.",
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
            TableName: TABLE_NAME,
            Item: newEvent
        }).promise();

        // Success response
        return {
            statusCode: 201,  
            
            body: JSON.stringify({ event: newEvent }),
        };

    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            body: "Internal server error" ,
        };
    }
};
