const { MongoClient } = require('mongodb');
const { MONGO_HOST, MONGO_DB_NAME } = require('./config');

// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb://${MONGO_HOST}?writeConcern=majority`;

const client = new MongoClient(uri);
let database;
let connectErr = null;

async function getDatabase() {
  if (database) {
    return database;
  }
  if (connectErr) {
    throw new Error(`Previous attempt to connect failed: ${connectErr.message}`);
  }
  try {
    await client.connect();
    return client.db(MONGO_DB_NAME);
  } catch (err) {
    connectErr = err;
    throw err;
  }
}

async function getVideo(videoId) {
  try {
    const db = await getDatabase();
    const videos = db.collection('videos');
    const query = { _id: videoId };
    const video = await videos.findOne(query);
    return video;
  } catch (err) {
    console.error(`Error while getting video: ${err.message}`);
    throw err;
  }
}

module.exports = { getVideo };
