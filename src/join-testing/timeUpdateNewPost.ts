import { choose } from '../common'
import { loadTest } from '../timing'
import { mkDb, newIdPost, newPost } from './common'

const qps = 10
const durationMs = 4000

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ userA, userB, postB, userC, postC }) => {
    // Setup
    const userAs = await userA.find({}).toArray()
    const userBs = await userB.find({}).toArray()
    const userCs = await userC.find({}).toArray()

    // Testing
    await loadTest({
      filename:
        __dirname + `/data/timeUpdateNewPost.${new Date().getTime()}.A.json`,
      name: 'timeA',
      qps,
      durationMs,
      fn: async () => {
        const user = choose(userAs)
        const result = await userA.unsafe.updateOne(
          { _id: user._id },
          { $push: { posts: newIdPost() } }
        )
        return result
      },
    })
    console.log('Tested A')

    await loadTest({
      filename:
        __dirname + `/data/timeUpdateNewPost.${new Date().getTime()}.B.json`,
      name: 'timeB',
      qps,
      durationMs,
      fn: async () => {
        const user = choose(userBs)
        const newPost = newIdPost()
        const results = await Promise.all([
          await userB.updateOne(
            { _id: user._id },
            { $push: { postIds: newPost._id } }
          ),
          await postB.insertOne(newPost),
        ])
        return results
      },
    })
    console.log('Tested B')

    await loadTest({
      filename:
        __dirname + `/data/timeUpdateNewPost.${new Date().getTime()}.C.json`,
      name: 'timeC',
      qps,
      durationMs,
      fn: async () => {
        const user = choose(userCs)
        const result = await postC.insertOne({ ...newPost(), userId: user._id })
        return result
      },
    })
    console.log('Tested C')
  })
}

main()
