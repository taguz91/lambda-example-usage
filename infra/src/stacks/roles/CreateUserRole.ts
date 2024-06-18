import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface CreateUserRoleProps {
  dynamoDBArn: string;
}

export class CreateUserRole extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: CreateUserRoleProps) {
    super(scope, id);

    const role = new Role(this, 'CreateUserRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role to create a new item',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'CreateUserRolePolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowWriteNewUser',
                Effect: 'Allow',
                Action: [
                  'dynamodb:PutItem',
                ],
                Resource: props.dynamoDBArn,
              },
            ],
          }),
        }),
      ],
    });

    this.arn = role.roleArn;
  }
}