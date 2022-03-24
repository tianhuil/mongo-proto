import { choose } from '../common'
import { loadTest } from '../timing'
import { mkDb, newIdPost, newPost } from './common'

const qps = 10
const durationMs = 4000

const main = async () => {
  const db = mkDb()

  await db.withDb(
    async ({ userA, userB, userC, createPostA, createPostB, createPostC }) => {
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
          return createPostA(user._id, newIdPost())
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
          return createPostB(user._id, newIdPost())
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
          return createPostC({ ...newPost(), userId: user._id })
        },
      })
      console.log('Tested C')
    }
  )
}

main()
