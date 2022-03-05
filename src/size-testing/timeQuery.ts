import { choose } from '../common'
import { loadTest } from '../timing'
import { fetchIds, mkDb, sizes } from './common'

const qps = 10
const durationMs = 5000

const main = async () => {
  const db = mkDb()

  await db.withDb(async ({ blobStr, blobStrArr }) => {
    // Testing
    for (const size of sizes) {
      const ids = await fetchIds(blobStr, size)
      await loadTest({
        filename:
          __dirname + `/data/blobStr.${new Date().getTime()}.${size}.json`,
        name: `blobStr ${size}`,
        qps,
        durationMs,
        fn: async () => {
          const id = choose(ids)
          const result = await blobStr.findOne({ _id: id })
          if (!result) return null
          return result.text.length
        },
      })
      console.log(`Completed BlobStr Size ${size}`)
    }

    // Testing
    for (const size of sizes) {
      const ids = await fetchIds(blobStrArr, size)
      await loadTest({
        filename:
          __dirname + `/data/blobStrArr.${new Date().getTime()}.${size}.json`,
        name: `blobStrArr ${size}`,
        qps,
        durationMs,
        fn: async () => {
          const id = choose(ids)
          const result = await blobStrArr.findOne({ _id: id })
          if (!result) return null
          return result.texts.map((x) => x.length).reduce((x, y) => x + y)
        },
      })
      console.log(`Completed BlobStrArr Size ${size}`)
    }
  })
}

main()
