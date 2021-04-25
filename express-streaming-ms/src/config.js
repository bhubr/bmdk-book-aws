require('dotenv').config();

const requiredVars = [
  'PORT',
  'VIDEO_STORAGE_HOST',
  'VIDEO_STORAGE_PORT',
];

const config = {};

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable ${varName}`);
  }
  config[varName] = process.env[varName];
});

module.exports = config;
