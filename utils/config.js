require('dotenv').config()

let MONGODB_URI = process.env.MONGO_DB
const { PORT } = process.env

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGO_DB
}
module.exports = {
  MONGODB_URI,
  PORT,
}
