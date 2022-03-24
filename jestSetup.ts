import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: MongoMemoryServer
let client: MongoClient

beforeAll(async () => {
  process.env.JWT_KEY = 'abc'
  const port = parseInt(process.env.MONGO_TEST_PORT ?? '')
  mongo = new MongoMemoryServer({ instance: { port } })
  await mongo.start()
  client = new MongoClient(process.env.MONGO_TEST_URL ?? '')
  await client.connect()
})

afterAll(async () => {
  await client.close()
  await mongo.stop()
})
