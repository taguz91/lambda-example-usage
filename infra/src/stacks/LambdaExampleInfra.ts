import { CfnOutput, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CreateUserRole } from './roles/CreateUserRole';
import { DeleteUserRole } from './roles/DeleteUserRole';
import { EditUserRole } from './roles/EditUserRole';
import { ListUserRole } from './roles/ListUserRole';
import { NewUserRole } from './roles/NewUserRole';
import { SendEmailRole } from './roles/SendEmailRole';
import { SetupConfigUser } from './roles/SetupUserRole';
import SimpleBucketS3Role from './roles/SimpleBucketS3Role';
import DatabaseDynamoDB from './shared/DatabaseDynamoDB';
import SendEmailSQS from './shared/SendEmailSQS';
import SignupSNS from './shared/SignupSNS';
import SimpleBucketS3 from './shared/SimpleBucketS3';

import { Environment } from 'src/interface';

interface LambdaExampleInfraProps {
  env: Environment;
}

export default class LambdaExampleInfra extends Stack {

  constructor(scope: Construct, id: string, props: LambdaExampleInfraProps) {
    super(scope, id, props);

    const simpleS3 = new SimpleBucketS3(this, 'SimpleBucketS3');
    const dbTableDynamoDB = new DatabaseDynamoDB(this, 'DatabaseTable');
    const sendEmailSQS = new SendEmailSQS(this, 'SendEmailSQS');

    const singupSNS = new SignupSNS(this, 'SignupSNS', {
      queue: sendEmailSQS.queue,
    });


    // roles create
    const roleSimpleS3 = new SimpleBucketS3Role(this, 'SimpleBucketRole', {
      bucketS3Arn: simpleS3.bucket.bucketArn,
    });

    const roleCreateUser = new CreateUserRole(
      this,
      'CreateUserRole',
      {
        dynamoDBArn: dbTableDynamoDB.db.tableArn,
      },
    );

    const roleEditUser = new EditUserRole(
      this,
      'EditUserRole',
      {
        dynamoDBArn: dbTableDynamoDB.db.tableArn,
      },
    );

    const roleDeleteUser = new DeleteUserRole(
      this,
      'DeleteUserRole',
      {
        dynamoDBArn: dbTableDynamoDB.db.tableArn,
      },
    );

    const roleListUser = new ListUserRole(
      this,
      'ListUserRole',
      {
        dynamoDBArn: dbTableDynamoDB.db.tableArn,
      },
    );

    const roleNewUser = new NewUserRole(
      this,
      'NewUserRole',
      {
        dynamoDBArn: dbTableDynamoDB.db.tableArn,
        snsArn: singupSNS.sns.topicArn,
      },
    );

    const roleSendEmail = new SendEmailRole(
      this,
      'SendEmailRole',
      {
        sqsArn: sendEmailSQS.queue.queueArn,
      },
    );

    const roleSetupUser = new SetupConfigUser(
      this,
      'SetupConfigRole',
      {
        dynamoArn: dbTableDynamoDB.db.tableArn,
        snsArn: singupSNS.sns.topicArn,
      },
    );

    // outputs
    new CfnOutput(this, 'SimpleBucketRoleOutput', {
      value: roleSimpleS3.arn,
      description: 'Role for read keys objects from bucket',
      exportName: this.exportNameWrapper('SimpleBucketRoleArn'),
    });

    new CfnOutput(this, 'CreateUserRoleOutput', {
      value: roleCreateUser.arn,
      description: 'Role for create new users',
      exportName: this.exportNameWrapper('CreateUserRoleArn'),
    });

    new CfnOutput(this, 'EditUserRoleOutput', {
      value: roleEditUser.arn,
      description: 'Role for edit users',
      exportName: this.exportNameWrapper('EditUserRoleArn'),
    });

    new CfnOutput(this, 'DeleteUserRoleOutput', {
      value: roleDeleteUser.arn,
      description: 'Role for delete users',
      exportName: this.exportNameWrapper('DeleteUserRoleArn'),
    });

    new CfnOutput(this, 'ListUserRoleOutput', {
      value: roleListUser.arn,
      description: 'Role for list users',
      exportName: this.exportNameWrapper('ListUserRoleArn'),
    });

    new CfnOutput(this, 'NewUserRoleOutput', {
      value: roleNewUser.arn,
      description: 'Role for new users',
      exportName: this.exportNameWrapper('NewUserRoleArn'),
    });

    new CfnOutput(this, 'SendEmailRoleOutput', {
      value: roleSendEmail.arn,
      description: 'Role for send emails',
      exportName: this.exportNameWrapper('SendEmailRoleArn'),
    });

    new CfnOutput(this, 'SetupConfigRoleOutput', {
      value: roleSetupUser.arn,
      description: 'Role for setup configuration',
      exportName: this.exportNameWrapper('SetupConfigRoleArn'),
    });

    // output services
    new CfnOutput(this, 'BucketS3NameOutput', {
      value: simpleS3.bucket.bucketName,
      description: 'Simple bucket name',
      exportName: this.exportNameWrapper('SimpleBucketName'),
    });

    new CfnOutput(this, 'UserTableOutput', {
      value: dbTableDynamoDB.db.tableArn,
      description: 'Table arn',
      exportName: this.exportNameWrapper('UserTableArn'),
    });

    new CfnOutput(this, 'SingupTopicArnOutput', {
      value: singupSNS.sns.topicArn,
      description: 'Singup topic arn output',
      exportName: this.exportNameWrapper('SingupTopicArn'),
    });

    new CfnOutput(this, 'SendEmailSqsUrlOutput', {
      value: sendEmailSQS.queue.queueUrl,
      description: 'Send email sqs url',
      exportName: this.exportNameWrapper('SendEmailSqsUrl'),
    });

    new CfnOutput(this, 'SendEmailSqsArnOutput', {
      value: sendEmailSQS.queue.queueArn,
      description: 'Send email sqs arn',
      exportName: this.exportNameWrapper('SendEmailSqsArn'),
    });
  }

  private exportNameWrapper(name: string) {
    return `${this.stackName}-${name}`;
  }
}