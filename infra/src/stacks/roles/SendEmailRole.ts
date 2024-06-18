import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface SendEmailRoleProps {
  sqsArn: string;
}

export class SendEmailRole extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: SendEmailRoleProps) {
    super(scope, id);

    const role = new Role(this, 'SendEmailRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Send email when register',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'SendEmailRolePolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowReadFromSourceQueue',
                Effect: 'Allow',
                Action: ['sqs:ReceiveMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'],
                Resource: props.sqsArn,
              },
            ],
          }),
        }),
      ],
    });

    this.arn = role.roleArn;
  }
}