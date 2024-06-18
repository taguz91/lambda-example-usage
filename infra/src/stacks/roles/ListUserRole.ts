import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface ListUserRoleProps {
  dynamoDBArn: string;
}

export class ListUserRole extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: ListUserRoleProps) {
    super(scope, id);

    const role = new Role(this, 'ListUserRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role to list users',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'ListUserRolePolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowDeleteUser',
                Effect: 'Allow',
                Action: [
                  'dynamodb:Scan',
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