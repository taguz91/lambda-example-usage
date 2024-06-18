import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface NewUserRoleProps {
  dynamoDBArn: string;
  snsArn: string;
}

export class NewUserRole extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: NewUserRoleProps) {
    super(scope, id);

    const role = new Role(this, 'NewUserRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role to register a new user',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'NewUserRolePolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowCreateNewUser',
                Effect: 'Allow',
                Action: [
                  'dynamodb:PutItem',
                ],
                Resource: props.dynamoDBArn,
              },
              {
                Sid: 'AllowPublishSNSMessage',
                Effect: 'Allow',
                Action: [
                  'sns:Publish',
                ],
                Resource: props.snsArn,
              },
            ],
          }),
        }),
      ],
    });

    this.arn = role.roleArn;
  }
}