import mongoose from 'mongoose'
import { UserModel } from './schema'

const mongoUri = 'mongodb://127.0.0.1:9341/test?retryWrites=true&w=majority'

beforeAll(async () => {
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
})

test('Can create new elements with aliases works', async () => {
  const model = new UserModel({
    nameAlias: 'a',
    email: 'a',
    addressAlias: { street: 'a', city: 'a', state: 'a' },
  })
  const result = await model.save()

  const user = await UserModel.findById(result._id)
  expect(user).toBeTruthy()
  expect(user!.name).toBe('a')
  expect((user! as any).nameAlias).toBe('a')
  expect(user!.address.street).toBe('a')
  expect((user! as any).addressAlias.street).toBe('a')
})

test('Querying on non-existent field in mongoose is incorrectly ignored', async () => {
  const model = new UserModel({
    nameAlias: 'a',
    email: 'a',
    addressAlias: { street: 'a', city: 'a', state: 'a' },
  })
  const result = await model.save()

  // test works properly
  expect(result.id).toBeTruthy()
  expect((await UserModel.findOne({ name: 'a' }))?.id).toBe(result.id)
  expect((await UserModel.findOne({ name: 'b' }))?.id).toBeUndefined()

  // it ignores queries on fields that don't exist
  expect((await UserModel.findOne({ noFieldExists: 'a' }))?.id).toBe(result.id)
})

test('Querying on optional field in mongoose is correctly handled', async () => {
  const model = new UserModel({
    nameAlias: 'a',
    email: 'a',
    addressAlias: { street: 'a', city: 'a', state: 'a' },
  })
  const result = await model.save()

  // test works properly
  expect(result.id).toBeTruthy()

  // it ignores queries on fields that don't exist
  expect((await UserModel.findOne({ avatar: 'a' }))?.id).toBeUndefined()
  expect((await UserModel.findOne({ nameAlias: 'a' }))?.id).toBe(result.id)
})

test('Cannot query with alias in dot notation', async () => {
  const model = new UserModel({
    nameAlias: 'a',
    email: 'a',
    addressAlias: { street: 'a', city: 'a', state: 'a' },
  })
  const result = await model.save()

  // test works properly
  expect(result.id).toBeTruthy()

  // dot notation works
  expect((await UserModel.findOne({ 'address.street': 'a' }))?.id).toBe(
    result.id
  )
  expect(
    (await UserModel.findOne({ 'address.street': 'b' }))?.id
  ).toBeUndefined()

  // alias ist just ignored
  expect((await UserModel.findOne({ 'addressAlias.street': 'a' }))?.id).toBe(
    result.id
  )
  expect((await UserModel.findOne({ 'addressAlias.street': 'b' }))?.id).toBe(
    result.id
  )
})
