const express = require('express');
const http = require('http');
const morgan = require('morgan');
const { ObjectID } = require('mongodb');
const {
  PORT: port,
  VIDEO_STORAGE_HOST: storageHost,
  VIDEO_STORAGE_PORT: storagePort,
} = require('./config');
const { getVideo } = require('./mongo');

const app = express();
app.use(morgan('tiny'));

app.get('/videos/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await getVideo(videoId);
    console.log('GOT VIDEO', videoId, video);
    if (video === null || Object.keys(video).length === 0) {
      return res.status(404).json({
        error: `No video with id ${videoId}`,
      });
    }
    const forwardReq = http.request(
      {
        host: storageHost,
        port: storagePort,
        path: `/video?path=${video.path}`,
        method: 'GET',
        headers: req.headers,
      },
      (forwardRes) => {
        res.writeHeader(forwardRes.statusCode, forwardRes.headers);
        forwardRes.pipe(res);
      },
    );

    return req.pipe(forwardReq);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Video streaming microservice listening on port ${port}`);
});
