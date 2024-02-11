import { itemHandler } from '../../../src/handlers/item-handlers.mjs';

import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from "aws-sdk-client-mock";
 
describe('Test softDeleteItemByIdHandler', () => { 
    const ddbMock = mockClient(DynamoDBDocumentClient);
 
    beforeEach(() => {
        ddbMock.reset();
    });
 
    it('should return isActive at false after a soft delete', async () => { 
        const item = { id: 'id1', isActive: false }; 
 
        // Return the specified value whenever the spied scan function is called 
        ddbMock.on(PutCommand).resolves({
            Items: item,
        }); 
 
        const event = { 
            httpMethod: 'DELETE',
            pathParameters: { 
                id: 'id1'
            }
        };
 
        // Invoke helloFromLambdaHandler() 
        const result = await itemHandler(event); 
 
        const expectedResult = { 
            statusCode: 200, 
            body: "\"Success - item deleted (soft)\""
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
