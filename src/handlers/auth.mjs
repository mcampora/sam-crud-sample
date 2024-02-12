const standardPolicy = {
    "principalId": "user",
    "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "execute-api:Invoke",
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:execute-api:*:*:*/*/GET/*"
                ]
            }
        ]
    }
};

const adminPolicy = {
    "principalId": "user",
    "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "execute-api:Invoke",
                "Effect": "Allow",
                "Resource": "*"
            }
        ]
    }
};

const defaultDenyAllPolicy = {
    "principalId": "user",
    "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "execute-api:Invoke",
                "Effect": "Deny",
                "Resource": "*"
            }
        ]
    }
};

// simulate a JWT authorisation
// actually the authorizer is simply looking for an authorization token
// then will select the policy based on plain text value of the token
// a production like authorizer would contact an OIDC provider to decode and validate the token
export const handler = async (event, context) => {
    let iamPolicy = defaultDenyAllPolicy;
    const token = event.authorizationToken.replace("Bearer ", "");
    console.log('JWT Token', token)
    if (token == 'standard') {
        iamPolicy = standardPolicy;
    }
    else if (token =='admin') {
        iamPolicy = adminPolicy;
    }
    console.log('IAM Policy', JSON.stringify(iamPolicy));
    return iamPolicy;
};