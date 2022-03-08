import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: MongoMemoryServer
let client: MongoClient

beforeAll(async () => {
  process.env.JWT_KEY = 'abc'
  mongo = new MongoMemoryServer({ instance: { port: 9341 } })
  await mongo.start()
  const mongoUri = 'mongodb://127.0.0.1:9341/test?retryWrites=true&w=majority'
  client = new MongoClient(mongoUri)

  await client.connect()
})

beforeEach(async () => {
  const collections = await client.db('test').listCollections()
  await Promise.all(
    await collections
      .map((collection) =>
        client.db('test').collection(collection.name).deleteMany({})
      )
      .toArray()
  )
})

afterAll(async () => {
  await client.close()
  await mongo.stop()
})
