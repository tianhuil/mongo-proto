import { choose, fetchIds } from '../common'
import { loadTest } from '../timing'
import { mkDb, newIdPost, newPost } from './common'

const qps = 10
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
      filename: __dirname + `/data/timeCreate.${new Date().getTime()}.A.json`,
      name: 'timeA',
      qps,
      durationMs,
      fn: async () => {
        const userId = choose(userAIds)
        const result = await userA.updateOne(
          { _id: userId },
          { $push: { posts: newIdPost() } }
        )
        return [
          result.acknowledged,
          result.matchedCount,
          result.modifiedCount,
          result.upsertedCount,
        ]
      },
    })
    console.log('Tested A')

    await loadTest({
      filename: __dirname + `/data/timeCreate.${new Date().getTime()}.B.json`,
      name: 'timeB',
      qps,
      durationMs,
      fn: async () => {
        const userId = choose(userBIds)
        const newPost = newIdPost()
        const [result, _] = await Promise.all([
          userB.updateOne({ _id: userId }, { $push: { postIds: newPost._id } }),
          postB.insertOne(newPost),
        ])
        return [
          result.acknowledged,
          result.matchedCount,
          result.modifiedCount,
          result.upsertedCount,
        ]
      },
    })
    console.log('Tested B')

    await loadTest({
      filename: __dirname + `/data/timeCreate.${new Date().getTime()}.C.json`,
      name: 'timeC',
      qps,
      durationMs,
      fn: async () => {
        const userId = choose(userCIds)
        const result = await postC.insertOne({ ...newPost(), userId })
        return [result.acknowledged]
      },
    })
    console.log('Tested C')
  })
}

main()
