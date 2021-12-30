import { mkDb, User } from './db'

const timer = async <T>(fn: () => PromiseLike<T>): Promise<T> => {
  const t1 = new Date().getTime()
  const ret = await fn()
  const t2 = new Date().getTime()
  console.log('Time:', t2 - t1)
  return ret
}

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()
    await timer(async () => {
      const cursor = await db.user
        .find({ name: 'Alice' })
        .project<Pick<User, 'name'>>({ name: 1 })

      for await (const post of cursor) {
        console.log(post)
      }
    })

    await timer(async () => {
      const agg = db.post.aggregate([
        { $match: { title: 'a' } },
        {
          $lookup: {
            from: 'user',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
      ])
      for await (const post of agg) {
        console.log(post)
      }
    })
  } finally {
    db.close()
  }
}

main()
