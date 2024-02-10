// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.ITEM_TABLE;

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
export const softDeleteItemByIdHandler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`deleteMethod only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const id = event.pathParameters.id;

  const command = new UpdateCommand({
    TableName: tableName,
    Key: {
      id: id,
    },
    UpdateExpression: "set isActive = :active",
    ExpressionAttributeValues: {
      ":active": false,
    },
    ReturnValues: "ALL_NEW",
  });

  try {
      const data = await ddbDocClient.send(command);
      console.log("Success - item deleted (soft)", data);
  } catch (err) {
    console.log("Error", err.stack);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("Success - item deleted (soft)")
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
