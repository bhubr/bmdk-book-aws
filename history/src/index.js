const amqp = require('amqplib');
const {
  RABBIT: rabbitUrl,
} = require('./config');
const { recordView } = require('./mongo');

async function startConsumer() {
  const q = 'video:viewed';
  const conn = await amqp.connect(rabbitUrl);
  const ch = await conn.createChannel();
  await ch.assertQueue(q);
  ch.consume(q, async (msg) => {
    if (msg !== null) {
      const videoId = msg.content.toString();
      console.log(`** viewed ${videoId}`);
      await recordView(videoId);
      ch.ack(msg);
    }
  });
}

startConsumer()
  .then(() => {
    console.log('history/amqp consumer microservice running');
  })
  .catch((err) => {
    console.error('history/amqp consumer microservice error on startup', err);
  });
