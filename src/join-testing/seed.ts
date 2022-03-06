import { randomInt } from '../common'
import { mkDb, newIdPost, newPost, newUser } from './common'

const numUsers = 1000
const maxPostsPerAuthor = 25
const minPostsPerAuthor = 5

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()

    // A
    await Promise.all([db.userA.deleteMany({}), db.postA.deleteMany({})])
    await db.userA.insertMany(
      Array(numUsers)
        .fill(null)
        .map(() => ({
          ...newUser(),
          posts: Array(randomInt(minPostsPerAuthor, maxPostsPerAuthor))
            .fill(null)
            .map(newIdPost),
        }))
    )
    console.log('Wrote A')

    // B
    await Promise.all([db.userB.deleteMany({}), db.postB.deleteMany({})])
    const postResults = await Promise.all(
      Array(numUsers)
        .fill(null)
        .map(() =>
          db.postB.insertMany(
            Array(randomInt(minPostsPerAuthor, maxPostsPerAuthor))
              .fill(null)
              .map(newPost)
          )
        )
    )
    const postIdz = postResults.map((result) =>
      Object.values(result.insertedIds)
    )
    await db.userB.insertMany(
      postIdz.map((postIds) => ({ ...newUser(), postIds }))
    )
    console.log('Wrote B')

    // C
    await Promise.all([db.userC.deleteMany({}), db.postC.deleteMany({})])
    const usersResult = await db.userC.insertMany(
      Array(numUsers).fill(null).map(newUser)
    )
    const userIds = Object.values(usersResult.insertedIds)

    await db.postC.insertMany(
      userIds.flatMap((userId) =>
        Array(randomInt(minPostsPerAuthor, maxPostsPerAuthor))
          .fill(null)
          .map(() => ({ ...newPost(), userId }))
      )
    )
    await db.postC.createIndex({ userId: 1 })
    console.log('Wrote C')
  } finally {
    await db.close()
  }
}

main()
