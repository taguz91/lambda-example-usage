import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "user-layer";

export const listUser = async (event: APIGatewayEvent) => {
  await DynamoDB.delete(
    event.pathParameters.email
  );

  return {
    statusCode: 204,
  };
}