import { choose } from '../common'
import { loadTest } from '../timing'
import { mkDb } from './common'

const qps = 10
const durationMs = 4000

const main = async () => {
  const db = mkDb()

  await db.withDb(
    async ({ userA, postB, updatePostB, updatePostC, postC, updatePostA }) => {
      // Setup
      const userAs = await userA.find({}).toArray()
      const postBs = await postB.find({}).toArray()
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

          return updatePostA(user._id, postId)
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
          const postId = choose(postBs)
          return updatePostB(postId._id)
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
          return updatePostC(post._id)
        },
      })
      console.log('Tested C')
    }
  )
}

main()
