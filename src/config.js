import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 8080

export default {
  mongodb: {
    connection: {
      string: process.env.MONGO_CONNECTION_STRING || 'mongodb://mongodb:27017/bellman-test',
    },
  },
  port,
}
