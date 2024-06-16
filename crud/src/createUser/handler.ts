import type { APIGatewayEvent } from "aws-lambda"
import { DynamoDB } from 'user-layer'

export const createUser = async (event: APIGatewayEvent) => {
  const request = JSON.parse(event.body)

  if (!request.name) {
    return {
      statusCode: 422,
      body: JSON.stringify(
        {
          message: 'The name is required',
        }
      ),
    }
  }

  if (!request.email) {
    return {
      statusCode: 422,
      body: JSON.stringify(
        {
          message: 'The email is required',
        }
      ),
    }
  }

  const data = await DynamoDB.add({
    name: request.name,
    email: request.email,
  });

  return {
    statusCode: 201,
    body: JSON.stringify(
      data
    ),
  };
}