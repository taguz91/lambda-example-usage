import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface EditUserRoleProps {
  dynamoDBArn: string;
}

export class EditUserRole extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: EditUserRoleProps) {
    super(scope, id);

    const role = new Role(this, 'EditUserRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role to edit a item into dynamodb',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'EditUserRolePolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowEditUser',
                Effect: 'Allow',
                Action: [
                  'dynamodb:UpdateItem',
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