//import { getAllItemsHandler } from '../../../src/handlers/get-all-items.mjs';
import { itemHandler } from '../../../src/handlers/item-handlers.mjs';

import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from "aws-sdk-client-mock";
 
// This includes all tests for getAllItemsHandler() 
describe('Test getAllItemsHandler', () => { 
    const ddbMock = mockClient(DynamoDBDocumentClient);
 
    beforeEach(() => {
        ddbMock.reset();
    });
 
    it('should return all ids', async () => { 
        const items = [{ id: 'id1', isActive: true }, { id: 'id2', isActive: true }]; 
 
        // Return the specified value whenever the spied scan function is called 
        ddbMock.on(ScanCommand).resolves({
            Items: items,
        }); 
 
        const event = { 
            httpMethod: 'GET' 
        };
 
        // Invoke helloFromLambdaHandler() 
        const result = await itemHandler(event); 
 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(items) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 

    it('should return only one id', async () => { 
        const items = [{ id: 'id1', isActive: true }, { id: 'id2', isActive: false }]; 
        const itemsReturned = [{ id: 'id1', isActive: true }]; 
 
        // Return the specified value whenever the spied scan function is called 
        ddbMock.on(ScanCommand).resolves({
            Items: items,
        }); 
 
        const event = { 
            httpMethod: 'GET' 
        };
 
        // Invoke helloFromLambdaHandler() 
        const result = await itemHandler(event); 
 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(itemsReturned) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 

}); 
