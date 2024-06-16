import { SNSEvent } from "aws-lambda";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

interface ISignup {
  email: string
}

export const newUser = async (event: SNSEvent) => {
  const messages: ISignup[] = event.Records.map((record) => {
    return JSON.parse(record.Sns.Message)
  });

  for (const message of messages) {
    const command = new GetCommand({
      TableName: process.env.DYNAMO_DB_ARN.split(':table/')[1],
      Key: {
        Email: message.email,
      },
    });

    const response = await docClient.send(command);

    if (response.Item) {
      const command = new UpdateCommand({
        TableName: process.env.DYNAMO_DB_ARN.split(':table/')[1],
        Key: {
          Email: message.email
        },
        UpdateExpression: "set Name = :name",
        ExpressionAttributeValues: {
          ":Name": message.email.split('@')[0],
        },
        ReturnValues: "ALL_NEW",
      });

      await docClient.send(command);
    } else {
      console.log("The user not exists, the email wasn't registered")
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'setup new registrations',
        total: messages.length,
      }
    ),
  };
}