import { APIGatewayEvent } from "aws-lambda";
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const sns = new SNSClient({})

export const newUser = async (event: APIGatewayEvent) => {
  const request = JSON.parse(event.body)

  if (!request.email) {
    return {
      statusCode: 422,
      body: JSON.stringify(
        {
          message: 'The email is required for a new registration',
        }
      ),
    }
  }

  const command = new PutCommand({
    TableName: process.env.DYNAMO_DB_ARN.split(':table/')[1],
    Item: {
      Name: request.email,
      Email: request.email,
    },
  });

  const response = await docClient.send(command);

  try {
    await sns.send(new PublishCommand({
      TopicArn: process.env.NEW_SIGNUP_SNS_ARN,
      Subject: 'signup-user',
      Message: JSON.stringify({
        email: request.email
      })
    }))
    console.log("Send SNS event");
  } catch (error) {
    console.log("Can't send SNS event");
    console.log("ERROR: ", error.message);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(
      response.Attributes
    ),
  };
}