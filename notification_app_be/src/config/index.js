const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  TEST_SERVER_URL: process.env.TEST_SERVER_URL || 'http://localhost:4000',
  AUTH_RETRY_INTERVAL: 5000,
};
