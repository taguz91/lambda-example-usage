export const getEnvironment = () => {
  const account = process.env.AWS_ACCOUNT_ID;
  const region = process.env.AWS_REGION;
  const stage = process.env.STAGE;

  if (!account) throw new Error('AWS_ACCOUNT_ID is not defined');
  if (!region) throw new Error('AWS_REGION is not defined');
  if (!stage) throw new Error('STAGE is not defined');

  return {
    stage,
    region,
    account,
  };
};
