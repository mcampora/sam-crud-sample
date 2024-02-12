# sam-crud-sample
This project is a simple CRUD example based on the AWS Serverless Application Model (AWS SAM).  
The lambdas are written in JavaScript and simple custom authorizer lambda is used to demonstrate access control to the API.  

The project has been initiated with the AWS SAM command line interface (CLI).  
It includes the following files and folders:  
- `src` - JS code for the application's Lambda functions.
- `events` - Invocation events that you can use to invoke the function.
- `__tests__` - Unit tests for the application code. 
- `template.yaml` - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions, an API Gateway API, and Amazon DynamoDB tables. These resources are defined in the `template.yaml` file in this project.  

## Deploy the sample application
To use the AWS SAM CLI, you need the following tools:
* AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
* Node.js - [Install Node.js 18](https://nodejs.org/en/), including the npm package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

To build and deploy your application for the first time, run the following in your shell.
The first command will build the source of your application. The second command will package and deploy your application.
The API Gateway endpoint will be displayed in the outputs when the deployment is complete.
```bash
$ sam build
$ sam deploy
```

## Run unit tests
Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.
```bash
$ npm install
$ npm run test
```

## Use the AWS SAM CLI to build and test locally
Build your application by using the `sam build` command.
The AWS SAM CLI installs dependencies that are defined in `package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.
Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.
Run functions locally and invoke them with the `sam local invoke` command.
```bash
$ sam build
$ sam local invoke putItemFunction --event events/event-post-item.json
$ sam local invoke getAllItemsFunction --event events/event-get-all-items.json
```

If you experience issues check your target architecture in the Parameters section (ex. arm64 for MacOS silicon) and signout from the public ecr repository (ie. docker logout public.ecr.aws).  

## Test locally or remotely the API
The API is secured using a custom authorizer expecting a valid JWT token.
Use the following site to create a JWT token (https://jwt.io/).
The custom authorizer is using a hardcoded secret to validate the token signature (ie. 'my_secret') and does not integrate with any OpenID Connect service. A production grade solution would need to cover both.

The AWS SAM CLI can also emulate your application's API. Use the `sam local start-api` command to run the API locally on port 3000.
```bash
$ sam local start-api
$ curl http://localhost:3000/ -H "Authorization: Bearer <YOUR.ACCESS.TOKEN>"
```

For remote tests, deploy your service and use the endpoint displayed at the end of the deployment.  
```bash
$ sam deploy
$ curl https://<API-ID>.execute-api.<REGION>.amazonaws.com/Prod/items -H "Authorization: Bearer <YOUR.ACCESS.TOKEN>"
```

## Fetch, tail, and filter Lambda function logs
To simplify troubleshooting, the AWS SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs that are generated by your Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.
```bash
$ sam logs -n putItemFunction --stack-name sam-app --tail
```

## Cleanup
To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:
```bash
$ sam delete --stack-name sam-crud-sample
```

## Todo
- Auth0 integration 
  - API GW custom authorizers
    - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
    - https://auth0.com/docs/customize/integrations/aws/aws-api-gateway-custom-authorizers  
- hard delete if admin role
- webSocket API
- get_all with consistent pagination
  - proper scan with filter and global index
  - return and accept a pagination parameters (ie. page size, key)
- differentiate create and update