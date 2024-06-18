import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "user-layer";

export const deleteUser = async (event: APIGatewayEvent) => {
  await DynamoDB.delete(
    event.pathParameters.email
  );

  return {
    statusCode: 204,
    headers: { "Content-Type": "application/json" }
  };
}