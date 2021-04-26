require('dotenv').config();

const requiredVars = [
  'PORT',
  'VIDEO_STORAGE_HOST',
  'VIDEO_STORAGE_PORT',
  'MONGO_HOST',
  'MONGO_DB_NAME',
  'RABBIT',
  'FRONTEND_URL',
];

const config = {};

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable ${varName}`);
  }
  config[varName] = process.env[varName];
});

module.exports = config;
