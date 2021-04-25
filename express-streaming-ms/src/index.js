const express = require('express');
const http = require('http');
const morgan = require('morgan');
const {
  PORT: port,
  VIDEO_STORAGE_HOST: storageHost,
  VIDEO_STORAGE_PORT: storagePort,
} = require('./config');

const app = express();
app.use(morgan('tiny'));

app.get('/video', (req, res) => {
  const forwardReq = http.request(
    {
      host: storageHost,
      port: storagePort,
      path: '/video?path=SampleVideo_720x480_1mb.mp4',
      method: 'GET',
      headers: req.headers,
    }, (forwardRes) => {
      res.writeHeader(forwardRes.statusCode, forwardRes.headers);
      forwardRes.pipe(res);
    },
  );

  req.pipe(forwardReq);
});

app.listen(port, () => {
  console.log(`Video streaming microservice listening on port ${port}`);
});
