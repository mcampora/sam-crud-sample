import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

//export const main = async () => {
  const command = new ScanCommand({
    //FilterExpression: "isActive = :isActive",
    //FilterExpression: "id = :id",
    //ExpressionAttributeValues: {
      //":isActive": { BOOL: true }
      //":id": { S: "2" }
    //},
    //ProjectionExpression: "id, isActive",
    TableName: "sam-crud-sample-ItemTable-1FRBY46D5DINI",
  });
  const response = await docClient.send(command);
  const filtered = response.Items.filter(item => item.isActive === true);
  console.log(filtered);
//  return response;
//};
