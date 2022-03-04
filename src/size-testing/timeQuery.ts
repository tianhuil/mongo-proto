import { choose } from '../common'
import { loadTest } from '../timing'
import { fetchIds, mkDb, sizes } from './common'

const qps = 10
const durationMs = 5000

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ blobStr }) => {
    // Testing
    for (const size of sizes) {
      const ids = await fetchIds(blobStr, size)
      await loadTest({
        filename: __dirname + `/data/time.${new Date().getTime()}.${size}.json`,
        name: size.toString(),
        qps,
        durationMs,
        fn: async () => {
          const id = choose(ids)
          const result = await blobStr.findOne({ _id: id })
          if (!result) return null
          return [result.text.length]
        },
      })
      console.log(`Completed Size ${size}`)
    }
  })
}

main()
