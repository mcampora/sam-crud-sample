import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

//export const main = async () => {
  const command = new GetCommand({
    TableName: "sam-crud-sample-ItemTable-1FRBY46D5DINI",
    Key: {
      id: "1",
    },
  });

  const response = await docClient.send(command);
  console.log(response);
//  return response;
//};
