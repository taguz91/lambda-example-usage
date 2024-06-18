import { App } from 'aws-cdk-lib';
import { config } from 'dotenv';

import LambdaExampleInfra from './stacks/LambdaExampleInfra';
import { getEnvironment } from './utils';

config();

const env = getEnvironment();

const app = new App();

new LambdaExampleInfra(app, `lambda-infra-${env.stage}`, { env });

app.synth();