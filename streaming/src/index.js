const express = require('express');
const http = require('http');
const morgan = require('morgan');
const amqp = require('amqplib');
const cors = require('cors');
const {
  PORT: port,
  VIDEO_STORAGE_HOST: storageHost,
  VIDEO_STORAGE_PORT: storagePort,
  RABBIT: rabbitUrl,
  // FRONTEND_URL: frontendUrl,
} = require('./config');
const { getVideo, getVideosList } = require('./mongo');

const app = express();
app.use(morgan('tiny'));
app.use(cors({
  origin: 'http://localhost:3000', // frontendUrl,
}));

const q = 'video:viewed';
let ch;

async function startPublisher() {
  const conn = await amqp.connect(rabbitUrl);
  ch = await conn.createChannel();
  await ch.assertQueue(q);
}

app.get('/videos', async (req, res) => {
  try {
    const videos = await getVideosList();
    return res.json(videos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/videos/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await getVideo(videoId);
    if (video === null || Object.keys(video).length === 0) {
      return res.status(404).json({
        error: `No video with id ${videoId}`,
      });
    }
    ch.sendToQueue(q, Buffer.from(req.params.id));
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

startPublisher()
  .then(() => {
    app.listen(port, () => {
      console.log(`Video streaming microservice listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(`Video streaming microservice error on startup ${err.message}`);
    throw err;
  });
