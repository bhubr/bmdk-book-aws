const q = 'tasks';

const open = require('amqplib').connect('amqp://localhost');

// Publisher
open
  .then((conn) => conn.createChannel())
  .then((ch) =>
    ch
      .assertQueue(q)
      .then((ok) => ch.sendToQueue(q, Buffer.from('something to do'))),
  )
  .catch(console.warn);

// Consumer
open
  .then((conn) => conn.createChannel())
  .then((ch) =>
    ch.assertQueue(q).then((ok) =>
      ch.consume(q, (msg) => {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      }),
    ),
  )
  .catch(console.warn);
