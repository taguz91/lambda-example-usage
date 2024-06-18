import { DynamoDB } from "user-layer";

export const listUser = async () => {
  const data = await DynamoDB.list();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data
      }
    ),
    headers: { "Content-Type": "application/json" }
  };
}