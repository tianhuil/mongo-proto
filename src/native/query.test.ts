import { ObjectId } from 'mongodb'
import { mkDb } from './db'

const mongoUri = 'mongodb://127.0.0.1:9341/test?retryWrites=true&w=majority'

let db: ReturnType<typeof mkDb>

beforeAll(async () => {
  db = mkDb(mongoUri)
  await db.connect()
})

afterAll(async () => {
  if (db) await db.close()
})

test('querying on non-existent field works for native driver', async () => {
  const result = await db.post.insertOne({
    authorId: new ObjectId(),
    text: 'a',
    title: 'a',
  })
  const id = result.insertedId

  // using the field works properly
  expect((await db.post.findOne({ text: 'a' }))?._id).toStrictEqual(id)
  expect(await db.post.findOne({ text: 'b' })).toBeFalsy()

  // using a non-existent field should return nothing
  expect((await db.post.findOne({ foo: 'a' }))?._id).toBeFalsy()
})
