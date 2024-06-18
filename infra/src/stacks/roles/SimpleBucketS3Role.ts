import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface SimpleBucketS3RoleProps {
  bucketS3Arn: string;
}

export default class SimpleBucketS3Role extends Construct {
  public readonly arn: string;

  constructor(scope: Construct, id: string, props: SimpleBucketS3RoleProps) {
    super(scope, id);

    const role = new Role(this, 'SimpleBucketRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role to read the keys from S3 bucket',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        new ManagedPolicy(this, 'SimpleBucketRolePolicy', {
          document: PolicyDocument.fromJson({
            Statement: [
              {
                Sid: 'AllowListObjects',
                Effect: 'Allow',
                Action: ['s3:ListObjectsV2'],
                Resource: `${props.bucketS3Arn}/*`,
              },
            ],
          }),
        }),
      ],
    });

    this.arn = role.roleArn;
  }

}