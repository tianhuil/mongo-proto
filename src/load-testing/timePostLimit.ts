import { loadTest } from '../timing'
import { choose, fetchAuthorIds, mkDb } from './common'

const maxPostsPerAuthor = 25

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ post, user }) => {
    // Setup
    const authorIds = await fetchAuthorIds(user)

    // Testing
    await loadTest({
      filename: __dirname + `/data/timePostLimit.${new Date().getTime()}.json`,
      name: 'timePostLimit',
      qps: 110,
      durationMs: 10000,
      fn: async () => {
        const authorId = choose(authorIds)
        const results = await post
          .find({ authorId })
          .limit(maxPostsPerAuthor)
          .toArray()
        return [results.length, results[0]._id]
      },
    })
  })
}

main()
