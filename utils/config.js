require('dotenv').config()

const MONGODB_URI = process.env.MONGO_DB
const { PORT } = process.env

module.exports = {
  MONGODB_URI,
  PORT,
}
