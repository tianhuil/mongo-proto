import mongoose from 'mongoose'
import { createSchema, Type, typedModel } from 'ts-mongoose'

const UserSchema = createSchema(
  {
    email: Type.string({ required: true }),
  },
  { timestamps: true }
)

const PostSchema = createSchema(
  {
    title: Type.string({ required: true }),
    authorId: Type.objectId({ required: true }),
    body: Type.string({ required: false }),
    comments: Type.array().of({
      body: Type.string({ required: true }),
      date: Type.date({ required: true }),
    }),
  },
  { timestamps: true }
)

const setup = async () => {
  const connection = mongoose.createConnection(process.env.MONGO_URL ?? '')

  const User = typedModel(
    'User',
    UserSchema,
    undefined,
    undefined,
    undefined,
    connection
  )
  const Post = typedModel(
    'Post',
    PostSchema,
    undefined,
    undefined,
    undefined,
    connection
  )

  await User.deleteMany()
  await Post.deleteMany()

  const results = await User.insertMany([
    { email: 'a@gmail.com' },
    { email: 'b@gmail.com' },
  ])

  const [id1, id2] = results.map((x) => x.id)

  await Post.insertMany([
    {
      title: 'a',
      body: 'aaa',
      authorId: id1,
      comments: [],
    },
    {
      title: 'b',
      authorId: id2,
    },
  ])

  return { User, Post }
}

describe('$addToSet', () => {
  test('Can add to set', async () => {
    const { Post } = await setup()
    expect((await Post.findOne({ title: 'a' }).exec())?.comments).toHaveLength(
      0
    )

    await Post.updateMany(
      { title: 'a' },
      { $addToSet: { comments: { body: 'hi', date: new Date() } } }
    )

    expect((await Post.findOne({ title: 'a' }).exec())?.comments).toHaveLength(
      1
    )
  })

  test('No-op when there is no field', async () => {
    const { Post } = await setup()
    expect((await Post.findOne({ title: 'a' }).exec())?.comments).toHaveLength(
      0
    )

    await Post.updateMany(
      { title: 'a' },
      { $addToSet: { comments2: { body: 'hi', date: new Date() } } }
    )

    expect(
      ((await Post.findOne({ title: 'a' }).exec()) as any).comments2
    ).toBeUndefined()
  })

  test('Can add to array even when it is originally undefined', async () => {
    const { Post } = await setup()
    expect((await Post.findOne({ title: 'b' }).exec())?.comments).toHaveLength(
      0
    )

    await Post.updateMany(
      { title: 'b' },
      { $addToSet: { comments: { body: 'hi', date: new Date() } } }
    )

    expect((await Post.findOne({ title: 'b' }).exec())?.comments).toHaveLength(
      1
    )
  })
})

describe('$set', () => {
  test('Can set a field', async () => {
    const { Post } = await setup()
    expect((await Post.findOne({ title: 'a' }).exec())?.body).toBe('aaa')

    await Post.updateMany({ title: 'a' }, { $set: { body: 'abc' } })

    expect((await Post.findOne({ title: 'a' }).exec())?.body).toBe('abc')
  })

  test('Cannot a set a non-existent field', async () => {
    const { Post } = await setup()
    expect((await Post.findOne({ title: 'a' }).exec())?.body).toBe('aaa')

    await Post.updateMany({ title: 'a' }, { $set: { body2: 'abc' } })

    expect(
      ((await Post.findOne({ title: 'a' }).exec()) as any).body2
    ).toBeUndefined()
  })
})
