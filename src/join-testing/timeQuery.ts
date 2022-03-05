import { choose, fetchIds } from '../common'
import { loadTest } from '../timing'
import { mkDb } from './common'

const maxPostsPerAuthor = 5
const qps = 5
const durationMs = 4000

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ userA, userB, postB, userC, postC }) => {
    // Setup
    const userAIds = await fetchIds(userA)
    const userBIds = await fetchIds(userB)
    const userCIds = await fetchIds(userC)

    // Testing
    await loadTest({
      filename: __dirname + `/data/time.${new Date().getTime()}.A.json`,
      name: 'timeA',
      qps,
      durationMs,
      fn: async () => {
        const userId = choose(userAIds)
        const user = await userA.findOne({ _id: userId })
        if (!user) return null
        return [user._id, user.posts.length]
      },
    })
    console.log('Tested A')

    await loadTest({
      filename: __dirname + `/data/time.${new Date().getTime()}.B.json`,
      name: 'timeB',
      qps,
      durationMs,
      fn: async () => {
        const userId = choose(userBIds)
        const user = await userB.findOne({ _id: userId })
        if (!user) return null

        const posts = await postB.find({ _id: { $in: user.postIds } })
        return [user?._id, await posts.count()]
      },
    })
    console.log('Tested B')

    await loadTest({
      filename: __dirname + `/data/time.${new Date().getTime()}.C.json`,
      name: 'timeC',
      qps,
      durationMs,
      fn: async () => {
        const userId = choose(userCIds)
        const [user, post] = await Promise.all([
          userC.findOne({ _id: userId }),
          postC.find({ userId }),
        ])

        return [user?._id, await post.count()]
      },
    })
    console.log('Tested C')

    await loadTest({
      filename: __dirname + `/data/time.${new Date().getTime()}.C2.json`,
      name: 'timeC2',
      qps,
      durationMs,
      fn: async () => {
        const userId = choose(userCIds)

        const user = await userC
          .aggregate([
            { $match: { _id: userId } },
            {
              $lookup: {
                from: postC.collectionName,
                localField: '_id',
                foreignField: 'userId',
                as: 'posts',
              },
            },
          ])
          .limit(1)
          .toArray()

        return [user[0]._id, user[0].posts.length]
      },
    })
    console.log('Tested C2')
  })
}

main()
