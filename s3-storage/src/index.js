const express = require('express');
const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT || 5000;
const region = process.env.AWS_REGION || 'eu-west-3';

AWS.config.update({ region });

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const videoParams = { Bucket: 'bmdk-videos', Key: 'SampleVideo_720x480_1mb.mp4' };

app.get('/video', async (req, res, next) => {
  s3.getObject(videoParams)
    .on('httpHeaders', function (statusCode, headers) {
      if (statusCode >= 400) {
        return;
      }
      res.set('Content-Length', headers['content-length']);
      res.set('Content-Type', headers['content-type']);
      this.response.httpResponse.createUnbufferedStream()
        .pipe(res);
    })
    .on('error', next)
    .send();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Video streaming microservice listening on port ${port}`);
});
