const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT : process.env.PORT,
};