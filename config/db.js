const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI

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
    process.exit(1)// Stops server
  }
}

module.exports = connectDB
