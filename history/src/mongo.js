const { MongoClient, ObjectId } = require('mongodb');
const { MONGO_HOST, MONGO_DB_NAME } = require('./config');

// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb://${MONGO_HOST}?writeConcern=majority`;

const client = new MongoClient(uri);
let database;
let connectErr = null;

async function getDatabase() {
  if (client.isConnected() && database) {
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

async function recordView(videoId) {
  try {
    const db = await getDatabase();
    const videos = db.collection('views');
    const payload = { videoId, timestamp: Date.now() };
    const video = await videos.insert(payload);
    console.log('history:recordView', videoId, video);
    return video;
  } catch (err) {
    console.error(`Error while getting video: ${err.message}`);
    throw err;
  }
}

module.exports = { recordView };
