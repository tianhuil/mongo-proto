import { mkDb } from './common'

const numUsers = 1000
const maxPostsPerAuthor = 25
const minPostsPerAuthor = 5

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()

    // A
    await Promise.all([db.userA.deleteMany({}), db.postA.deleteMany({})])
    await db.seedA({ numUsers, maxPostsPerAuthor, minPostsPerAuthor })
    console.log('Wrote A')

    // B
    await Promise.all([db.userB.deleteMany({}), db.postB.deleteMany({})])
    await db.seedB({ numUsers, maxPostsPerAuthor, minPostsPerAuthor })
    console.log('Wrote B')

    // C
    await Promise.all([db.userC.deleteMany({}), db.postC.deleteMany({})])
    await db.seedC({ numUsers, maxPostsPerAuthor, minPostsPerAuthor })
    await db.postC.createIndex({ userId: 1 })
    console.log('Wrote C')
  } finally {
    await db.close()
  }
}

main()
