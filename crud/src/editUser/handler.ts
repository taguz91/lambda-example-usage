import { APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'user-layer';

export const editUser = async (event: APIGatewayEvent) => {
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

  await DynamoDB.edit({
    name: request.name,
    email: request.email,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      request
    ),
    headers: { "Content-Type": "application/json" }
  };
}