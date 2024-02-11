export const controler = async (table, fn, event) => {
    console.info('received:', event);
    var response = { statusCode: 200 };
    if (event.httpMethod == 'GET') {
        if (event?.pathParameters?.id === undefined) {
            const items = await table.getAll();
            response.body = JSON.stringify(items);
        }
        else {
            const id = event.pathParameters.id;
            const item = await table.get(id);
            response.body = JSON.stringify(item);
        }
    }
    else if (event.httpMethod == 'POST') {
        const body = JSON.parse(event.body);
        const result = await table.put(fn(body));
        response.body = JSON.stringify(result);
    }
    else if (event.httpMethod == 'DELETE') {
        const id = event.pathParameters.id;
        const result = await table.softDelete(id);
        response.body = JSON.stringify(result);
    }
    else {
        throw new Error(`Method not supported: ${event.httpMethod}`);
    } 
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}