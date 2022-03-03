import { loadTest } from '../timing'
import { choose, fetchAuthorIds, mkDb } from './common'

const maxPostsPerAuthor = 5

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ post, user }) => {
    // Setup
    const authorIds = await fetchAuthorIds(user)

    // Testing
    await loadTest({
      filename: __dirname + `/data/timePostAgg.${new Date().getTime()}.json`,
      name: 'timePostAgg',
      qps: 90,
      durationMs: 10000,
      fn: async () => {
        const authorId = choose(authorIds)
        const results = await db.user
          .aggregate([
            { $match: { _id: authorId } },
            {
              $lookup: {
                from: post.collectionName,
                localField: '_id',
                foreignField: 'authorId',
                as: 'posts',
              },
            },
          ])
          .limit(maxPostsPerAuthor)
          .toArray()
        return [
          results.length,
          results[0]['posts'].length,
          results[0]['posts'][0]['_id'],
        ]
      },
    })
  })
}

main()
