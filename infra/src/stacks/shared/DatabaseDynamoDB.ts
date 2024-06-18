import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export default class DatabaseDynamoDB extends Construct {

  public readonly db: Table;

  public constructor(scope: Construct, id: string) {
    super(scope, id);

    const db = new Table(this, 'users-table', {
      tableName: 'usuarios',
      partitionKey: {
        name: 'Email',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.db = db;
  }
}