import { DynamoDB } from "user-layer";

export const listUser = async () => {
  const data = await DynamoDB.list();

  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        data
      },
      null,
      2
    ),
  };
}