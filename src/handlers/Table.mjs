import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export class Table {
    constructor() {
        this.tableName = process.env.ITEM_TABLE;
        this.client = new DynamoDBClient({});
        this.ddbDocClient = DynamoDBDocumentClient.from(this.client);
    }
    async getAll() {
        try {
            const data = await this.ddbDocClient.send(new ScanCommand({ TableName : this.tableName }));
            var items = data.Items;
        } catch (err) {
            console.log("Error", err);
        }
        var filtered = []
        if (items) { filtered = items.filter(item => item.isActive === true); }
        return filtered;
    }
    async get(id) {
        var params = {
            TableName : this.tableName,
            Key: { id: id },
        };
        try {
            const data = await this.ddbDocClient.send(new GetCommand(params));
            var item = data.Item;
        } catch (err) {
            console.log("Error", err);
        }
        return item;
    }
    async put(obj) {
        obj.isActive = true;
        const command = new PutCommand({
            TableName: this.tableName,
            Item: obj
        });
        var data = null;
        try {
            const result = await this.ddbDocClient.send(command);
            data = result.returnedItem;
            console.log("Success - item added or updated", result);
        } catch (err) {
            console.log("Error", err.stack);
        }
        return data;
    }
    async softDelete(id) {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { id: id },
            UpdateExpression: "set isActive = :active",
            ExpressionAttributeValues: { ":active": false },
            ReturnValues: "ALL_NEW",
          });
          try {
              const data = await this.ddbDocClient.send(command);
              console.log("Success - item deleted (soft)", data);
          } catch (err) {
            console.log("Error", err.stack);
          }
          return "Success - item deleted (soft)";
    }
}
