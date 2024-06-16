import { Handler } from 'aws-lambda';

import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

export const simple: Handler = async () => {

  if (!process.env.BUCKET_NAME) {
    throw new Error('Bucket name is not provided');
  }

  const lisObjectsCommand = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME,
    MaxKeys: 10
  });

  const response = await s3Client.send(lisObjectsCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({
      total: response.Contents.length,
      data: response.Contents?.map((content) => ({
        key: content.Key,
        size: content.Size
      })),
    })
  }
}