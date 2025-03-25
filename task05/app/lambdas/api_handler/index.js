const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");


const dynamoDB = new AWS.DynamoDB.DocumentClient();


const table_name = process.env.target_table || "Events";

exports.handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event));

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
        if (!requestBody?.principalId || requestBody?.content === undefined) {
            console.error("Validation failed: Missing required fields", requestBody);
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "'principalId' (number) and 'content' (object) are required." }),
            };
        }

        // Create new event object
        const newEvent = {
            id: uuidv4(),
            principalId: Number(requestBody.principalId),
            createdAt: new Date().toISOString(),
            body: requestBody.content
        };

        // Save event to DynamoDB
        const response = await dynamoDBClient.send(new PutCommand({
            TableName: table_name,
            Item: newEvent,
        }));
        // await dynamoDB.put({
        //     TableName: table_name,
        //     Item: newEvent
        // }).promise();

        console.log("Successfully stored event:", JSON.stringify(newEvent));

        // Success response
        return {
            statusCode: 201,
            
            body: JSON.stringify({ statusCode : 201, event : newEvent }),
        };

    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
