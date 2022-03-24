import * as dfd from 'danfojs-node'
import glob from 'glob-promise'

const main = async () => {
  const files = await glob(__dirname + `/data/timeUpdateNewPost.*.json`)
  const results = await Promise.all(
    files.map((file) => dfd.readJSON(file) as Promise<dfd.DataFrame>)
  )
  const df = dfd.concat({ dfList: results, axis: 0 }) as dfd.DataFrame

  df.head(10).print()
  df.tail(10).print()

  df.groupby(['name'])
    .agg({ timeMs: ['mean', 'std', 'count'] })
    .print()
}

main()
