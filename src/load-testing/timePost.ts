import { WithId } from 'mongodb'
import { choose, mkDb, User } from './common'
import { loadTest } from './loadTest'

const maxPostsPerAuthor = 5

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ post, user }) => {
    // Setup
    const userResults = await user
      .find({})
      .project<Pick<WithId<User>, '_id'>>({ _id: 1 })

    const authorIds = await userResults.map((x) => x._id).toArray()

    // Testing
    await loadTest({
      filename: __dirname + `/data/timePost.${new Date().getTime()}.json`,
      name: 'loadPost',
      qps: 50,
      durationMs: 10000,
      fn: async () => {
        const authorId = choose(authorIds)
        const results = await Promise.all([
          user
            .find({ _id: authorId })
            .project<Pick<User, 'name' | 'rating'>>({ name: 1, rating: 1 })
            .limit(1)
            .toArray(),
          post.find({ authorId }).limit(maxPostsPerAuthor).toArray(),
        ])
        return [results[0].length, results[1].length]
      },
    })
  })
}

main()
