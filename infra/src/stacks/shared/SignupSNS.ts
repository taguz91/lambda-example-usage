import { Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

interface SignupSNSProps {
  queue: Queue;
}

export default class SignupSNS extends Construct {
  public readonly sns: Topic;

  constructor(scope: Construct, id: string, props: SignupSNSProps) {
    super(scope, id);

    const sns = new Topic(this, 'signup-user', {
      topicName: 'signup-user',
    });

    sns.addSubscription(new SqsSubscription(
      props.queue,
    ));

    this.sns = sns;
  }
}