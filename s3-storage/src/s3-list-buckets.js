// You need to have your AWS credentials setup via `aws configure` (stored under ~/.aws)

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({ region: 'eu-west-3' });

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Call S3 to list the buckets
s3.listBuckets((errListBuckets, data) => {
  if (errListBuckets) {
    console.log('Error', errListBuckets);
  } else {
    console.log('Success', data.Buckets);
    data.Buckets.forEach((bucket) => {
      const bucketParams = {
        Bucket: bucket.Name,
      };

      // Call S3 to obtain a list of the objects in the bucket
      s3.listObjects(bucketParams, (errListObjects, dataObjects) => {
        if (errListObjects) {
          console.log('Error', errListObjects);
        } else {
          console.log('Success', dataObjects);
        }
      });
    });
  }
});
