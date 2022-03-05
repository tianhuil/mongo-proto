import * as dfd from 'danfojs-node'
import glob from 'glob-promise'

interface TimingRaw {
  name: string
  qps: number
  timeMs: number
}

interface Timing extends TimingRaw {
  type: string
  size: number
}

const main = async () => {
  const files = await glob(__dirname + `/data/*.json`)
  const results = await Promise.all(
    files.map((file) => dfd.readJSON(file) as Promise<dfd.DataFrame>)
  )
  const dfRaw = dfd.concat({ dfList: results, axis: 0 }) as dfd.DataFrame

  dfRaw.head(10).print()
  dfRaw.tail(10).print()

  const df = dfRaw
    .addColumn(
      'type',
      dfRaw['name'].map((x: string) => x.split(' ')[0])
    )
    .addColumn(
      '_size',
      dfRaw['name'].map((x: string) => x.split(' ')[1])
    )

  df.groupby(['type', '_size'])
    .agg({ timeMs: ['mean', 'std'], result: ['mean'] })
    .print()
}

main()
