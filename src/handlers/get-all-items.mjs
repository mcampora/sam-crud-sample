import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.ITEM_TABLE;

export const getAllItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);

    // Get all items from the table 
    // which are not flagged as deleted
    // (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
    
    var params = {
        TableName : tableName,
        //ExpressionAttributeValues: {
            //":a": {
                //"BOOL": false
            //}
        //},
        //FilterExpression: "isActive != :a"
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        var items = data.Items;
    } catch (err) {
        console.log("Error", err);
    }
    const filtered = items.filter(item => item.isActive === true);
    const response = {
        statusCode: 200,
        body: JSON.stringify(filtered)
    };
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
