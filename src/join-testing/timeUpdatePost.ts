import { choose } from '../common'
import { loadTest } from '../timing'
import { mkDb } from './common'

const qps = 10
const durationMs = 4000

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ userA, userB, postB, userC, postC }) => {
    // Setup
    const userAs = await userA.find({}).toArray()
    const userBs = await userB.find({}).toArray()
    const postCs = await postC.find({}).toArray()

    // Testing
    await loadTest({
      filename:
        __dirname + `/data/timeUpdatePost.${new Date().getTime()}.A.json`,
      name: 'timeA',
      qps,
      durationMs,
      fn: async () => {
        const user = choose(userAs)
        const postId = choose(user.posts)._id
        // TODO: make this safe
        const result = await userA.unsafe.updateOne(
          { _id: user._id, posts: { $elemMatch: { _id: postId } } },
          { $inc: { 'posts.$.rating': 1 } }
        )
        return result
      },
    })
    console.log('Tested A')

    await loadTest({
      filename:
        __dirname + `/data/timeUpdatePost.${new Date().getTime()}.B.json`,
      name: 'timeB',
      qps,
      durationMs,
      fn: async () => {
        const user = choose(userBs)
        const postId = choose(user.postIds)
        const result = await postB.updateOne(
          { _id: postId },
          { $inc: { rating: 1 } } // TODO: rating can be anything
        )
        return result
      },
    })
    console.log('Tested B')

    await loadTest({
      filename:
        __dirname + `/data/timeUpdatePost.${new Date().getTime()}.C.json`,
      name: 'timeC',
      qps,
      durationMs,
      fn: async () => {
        const post = choose(postCs)
        const result = await postC.updateOne(
          { _id: post._id },
          { $inc: { rating: 1 } }
        )
        return result
      },
    })
    console.log('Tested C')
  })
}

main()
