import { Queue, QueueEncryption } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export default class SendEmailSQS extends Construct {
  public readonly queue: Queue;
  public readonly dlq: Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const dlq = new Queue(this, 'send-email-dlq', {
      encryption: QueueEncryption.UNENCRYPTED,
      queueName: 'custom-field-chunk-to-migrate-dlq',
    });

    const queue = new Queue(this, 'send-email-queue', {
      encryption: QueueEncryption.UNENCRYPTED,
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: dlq,
      },
      queueName: 'custom-field-chunk-to-migrate-sqs',
    });

    this.dlq = dlq;
    this.queue = queue;
  }
}