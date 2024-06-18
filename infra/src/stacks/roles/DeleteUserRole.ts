import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface DeleteUserRoleProps {
  dynamoDBArn: string;
}

export class DeleteUserRole extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: DeleteUserRoleProps) {
    super(scope, id);

    const role = new Role(this, 'DeleteUserRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role to delete item',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'DeleteUserRolePolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowDeleteUser',
                Effect: 'Allow',
                Action: [
                  'dynamodb:DeleteItem',
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