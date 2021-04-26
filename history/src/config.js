require('dotenv').config();

const requiredVars = [
  'MONGO_HOST',
  'MONGO_DB_NAME',
  'RABBIT',
];

const config = {};

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable ${varName}`);
  }
  config[varName] = process.env[varName];
});

module.exports = config;
