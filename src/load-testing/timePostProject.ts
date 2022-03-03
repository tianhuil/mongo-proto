import { WithId } from 'mongodb'
import { choose, fetchAuthorIds, mkDb, Post, User } from '../common'
import { loadTest } from '../timing'

const maxPostsPerAuthor = 5

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ post, user }) => {
    // Setup
    const authorIds = await fetchAuthorIds(user)

    // Testing
    await loadTest({
      filename:
        __dirname + `/data/timePostProject.${new Date().getTime()}.json`,
      name: 'timePostProject',
      qps: 60,
      durationMs: 10000,
      fn: async () => {
        const authorId = choose(authorIds)
        const results = await Promise.all([
          user
            .find({ _id: authorId })
            .project<Pick<WithId<User>, 'name' | 'rating'>>({
              name: 1,
              rating: 1,
            })
            .limit(1)
            .toArray(),
          post
            .find({ authorId })
            .project<Omit<Post, 'text'>>({ text: 0 })
            .limit(maxPostsPerAuthor)
            .toArray(),
        ])
        return [
          results[0].length,
          results[1].length,
          (results[1] as unknown as Post).text,
        ]
      },
    })
  })
}

main()
