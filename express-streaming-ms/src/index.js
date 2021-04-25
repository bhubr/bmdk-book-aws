const express = require('express');
const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');

const app = express();
const port = process.env.PORT || 5000;
const statAsync = promisify(fs.stat);

app.get('/video', async (req, res) => {
  try {
    const videoPath = join(__dirname, '../videos/SampleVideo_720x480_1mb.mp4');
    const stats = await statAsync(videoPath);
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stats.size,
    });
    return fs.createReadStream(videoPath).pipe(res);
  } catch (err) {
    console.error('Could not stat video file', err);
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Video streaming microservice listening on port ${port}`);
});
