import { MongoClient } from 'mongodb'

import config from './config'

let client

export default async () => {
  if (!client) {
    client = await MongoClient.connect(config.mongodb.connection.string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }

  return client.db()
}
