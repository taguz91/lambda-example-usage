import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface SetupConfigUserProps {
  dynamoArn: string;
  snsArn: string;
}

export class SetupConfigUser extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: SetupConfigUserProps) {
    super(scope, id);

    const role = new Role(this, 'SetupConfigUser', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Setup configuration email',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'SetupConfigUserPolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowUpdateUserData',
                Effect: 'Allow',
                Action: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
                Resource: props.dynamoArn,
              },
              {
                Sid: 'AllowReadFromSourceSNS',
                Effect: 'Allow',
                Action: ['sns:GetSMSAttributes'],
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