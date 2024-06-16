import { SQSEvent } from "aws-lambda";

interface ISignup {
  email: string
}

export const sendEmail = async (event: SQSEvent) => {
  const sqsMessages = event.Records.map((record) => {
    const body = JSON.parse(record.body);
    const message = JSON.parse(body.Message);

    return {
      subject: body.Subject as string,
      message: message as ISignup
    }
  });

  // send email to new register user
  for (const message of sqsMessages) {
    console.log("send email to", message.message)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'send emails',
        total: sqsMessages.length,
      }
    ),
  };
}