import faker from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { CreditCard, mkDb, Post, randomInt, User } from './common'

const maxCreditCards = 5
const numUsers = 1000
const maxPostsPerAuthor = 50

const newCreditCard = (): CreditCard => ({
  number: faker.finance.creditCardNumber(),
  cvv: faker.finance.creditCardNumber(),
  expiration: faker.date.future(4),
})

const newUser = (): User => ({
  name: faker.name.findName(),
  rating: randomInt(100),
  contact: { email: faker.internet.email() },
  creditCards: Array(randomInt(maxCreditCards)).fill(null).map(newCreditCard),
})

const newPost = (authorId: ObjectId): Post => ({
  authorId,
  text: faker.lorem.sentence(),
  title: faker.lorem.words(randomInt(1000)),
  date: faker.date.past(5),
})

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()

    const usersResult = await db.user.insertMany(
      Array(numUsers).fill(null).map(newUser)
    )
    const authorIds = Object.values(usersResult.insertedIds)
    console.info(`Successfully wrote ${authorIds.length} articles`)

    const postResult = await db.post.insertMany(
      authorIds.flatMap((authorId) =>
        Array(maxPostsPerAuthor)
          .fill(null)
          .map(() => newPost(authorId))
      )
    )
    console.info(`Successfully wrote ${postResult.insertedCount} articles`)
  } finally {
    await db.close()
  }
}

main()
