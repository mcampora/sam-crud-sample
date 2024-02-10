import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

//export const main = async () => {
  const command = new UpdateCommand({
    TableName: "sam-crud-sample-ItemTable-1FRBY46D5DINI",
    Key: {
      id: "2",
    },
    UpdateExpression: "set isActive = :active",
    ExpressionAttributeValues: {
      ":active": true,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  console.log(response);
//  return response;
//};