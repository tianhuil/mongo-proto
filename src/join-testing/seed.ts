import faker from '@faker-js/faker'
import { randomInt } from '../common'
import { mkDb, PostBase, UserBase } from './common'

const numUsers = 100
const maxPostsPerAuthor = 20

const newUser = (): UserBase => ({
  name: faker.name.findName(),
  rating: randomInt(100),
  contact: { email: faker.internet.email() },
})

const newPost = (): PostBase => ({
  text: faker.lorem.sentence(),
  title: faker.lorem.words(randomInt(100)),
  date: faker.date.past(5),
})

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()

    // A
    await db.userA.insertMany(
      Array(numUsers)
        .fill(null)
        .map(() => ({
          ...newUser(),
          posts: Array(randomInt(maxPostsPerAuthor)).fill(null).map(newPost),
        }))
    )
    console.log('Wrote A')

    // B
    const postResults = await Promise.all(
      Array(numUsers)
        .fill(null)
        .map(() =>
          db.postB.insertMany(Array(maxPostsPerAuthor).fill(null).map(newPost))
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
    const usersResult = await db.userC.insertMany(
      Array(numUsers).fill(null).map(newUser)
    )
    const userIds = Object.values(usersResult.insertedIds)

    await db.postC.insertMany(
      userIds.flatMap((userId) =>
        Array(maxPostsPerAuthor)
          .fill(null)
          .map(() => ({ ...newPost(), userId }))
      )
    )
    console.log('Wrote C')
  } finally {
    await db.close()
  }
}

main()
