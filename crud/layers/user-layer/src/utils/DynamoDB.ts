import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

import { PutCommand, DynamoDBDocumentClient, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { IUser } from "../types";

export class DynamoDB {
  static client = new DynamoDBClient();
  static docClient = DynamoDBDocumentClient.from(this.client);

  static async add(user: IUser) {
    const command = new PutCommand({
      TableName: process.env.DYNAMO_DB_ARN.split(':table/')[1],
      Item: {
        Name: user.name,
        Email: user.email,
      },
    });

    const response = await this.docClient.send(command);

    return response.Attributes;
  }

  static async edit(user: IUser) {
    const command = new UpdateCommand({
      TableName: process.env.DYNAMO_DB_ARN.split(':table/')[1],
      Key: {
        Email: user.email
      },
      UpdateExpression: "set Email = :email, Name = :name",
      ExpressionAttributeValues: {
        ":Name": user.name,
        ":Email": user.email,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await this.docClient.send(command);

    return response.Attributes;
  }

  static async delete(email: string) {
    const command = new DeleteCommand({
      TableName: process.env.DYNAMO_DB_ARN.split(':table/')[1],
      Key: {
        Email: email,
      },
    });

    const response = await this.docClient.send(command);

    return response.Attributes;
  }

  static async list() {
    const command = new ScanCommand({
      ProjectionExpression: "#Name, Email",
      ExpressionAttributeNames: { "#Name": "Name" },
      TableName: process.env.DYNAMO_DB_ARN.split(':table/')[1],
    });

    const response = await this.docClient.send(command);

    const list: IUser[] = [];

    for (const user of response.Items) {
      list.push({
        name: user.Name.S,
        email: user.Email.S
      })
    }

    return list;
  }
}
