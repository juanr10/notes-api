const mongoose = require('mongoose')
require('dotenv').config()

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

/**
 * @name:connectDB.
 * @description:Connects server to DB.
 * @param:none.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.log('DB notes connected')
  } catch (error) {
    console.log(error)
  }
}

const disconnectDB = async () => {
  await mongoose.disconnect()
}

module.exports = { connectDB, disconnectDB }
