require('dotenv').config();

const requiredVars = [
  'PORT',
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_ACCESS_KEY_SECRET',
]

const config = {};

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable ${varName}`);
  }
  config[varName] = process.env[varName];
});

module.exports = config;
