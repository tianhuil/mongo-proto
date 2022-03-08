import { mkDb, newIdPost, newPost } from './common'

let db: ReturnType<typeof mkDb>

const mongoUri = 'mongodb://127.0.0.1:9341/test?retryWrites=true&w=majority'

beforeAll(async () => {
  db = mkDb(mongoUri)
  await db.connect()
})

const singleSeedParams = {
  numUsers: 1,
  maxPostsPerAuthor: 1,
  minPostsPerAuthor: 1,
}

describe('test join testing', () => {
  test('Update PostA', async () => {
    const userSeed = await db.seedA(singleSeedParams)
    const userId = userSeed.insertedIds[0]
    const user = await db.userA.findOne({})
    expect(user).toBeTruthy()
    const post = user!.posts[0]
    expect(post).toBeTruthy()

    await db.updatePostA(userId, post!._id)

    const result = await db.userA.findOne({ _id: userId })
    expect(result).toBeTruthy()
    expect(result!.posts[0].rating).toBe(post!.rating + 1)
  })

  test('Update PostB', async () => {
    const [_, postSeed] = await db.seedB(singleSeedParams)
    const postId = postSeed[0].insertedIds[0]
    const post = await db.postB.findOne({ _id: postId })

    expect(post).toBeTruthy()

    await db.updatePostB(postId)

    const result = await db.postB.findOne({ _id: postId })
    expect(result).toBeTruthy()
    expect(result?.rating).toBe(post!.rating + 1)
  })

  test('Update PostC', async () => {
    const [_, postSeed] = await db.seedC(singleSeedParams)
    const postId = postSeed.insertedIds[0]
    const post = await db.postC.findOne({ _id: postId })
    expect(post).toBeTruthy()

    await db.updatePostC(postId)

    const result = await db.postC.findOne({ _id: postId })
    expect(result).toBeTruthy()
    expect(result?.rating).toBe(post!.rating + 1)
  })

  test('Add PostA', async () => {
    const userSeed = await db.seedA(singleSeedParams)
    const userId = userSeed.insertedIds[0]

    const newPost = newIdPost()
    await db.createPostA(userId, newPost)

    const result = await db.userA.findOne({ _id: userId })
    expect(result).toBeTruthy()
    expect(result!.posts.map((p) => p._id)).toContainEqual(newPost._id)
  })

  test('Add PostB', async () => {
    const [userSeed, _] = await db.seedB(singleSeedParams)
    const userId = userSeed.insertedIds[0]

    const newPost = newIdPost()
    const postId = newPost._id
    await db.createPostB(userId, newPost)

    expect(await db.postB.findOne({ _id: postId })).toBeTruthy()
    const userResult = await db.userB.findOne({})
    expect(userResult).toBeTruthy()
    expect(userResult?.postIds).toContainEqual(postId)
  })

  test('Add PostC', async () => {
    const [userSeed, _] = await db.seedC(singleSeedParams)
    const userId = userSeed.insertedIds[0]

    const newPostResult = await db.createPostC({
      ...newPost(),
      userId: userId,
    })

    const result = await db.postC.findOne({ _id: newPostResult.insertedId })
    expect(result).toBeTruthy()
    expect(result?.userId).toEqual(userId)
  })
})

afterAll(async () => {
  if (db) await db.close()
})
