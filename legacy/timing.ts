import fs from 'fs'

interface LoadTestParam<T> {
  filename: string
  name: string
  qps: number
  durationMs: number
  fn: () => Promise<T>
  newlineDelimited?: boolean // default is false
}

interface TimedRun<T> {
  name: string
  qps: number
  timeMs: number
  i: number
  result: T
}

const setNIntervals = async <T>(
  fn: (i: number) => Promise<T>,
  delayMs: number,
  repetitions: number
): Promise<T[]> => {
  return new Promise((resolve) => {
    let i = 0
    const promises = new Array<Promise<T>>(repetitions)

    const intervalID = setInterval(() => {
      promises[i] = fn(i)
      if (++i === repetitions) {
        clearInterval(intervalID)
        resolve(Promise.all(promises))
      }
    }, delayMs)
  })
}

export const loadTest = async <T>({
  filename,
  name,
  qps,
  durationMs,
  fn,
  newlineDelimited,
}: LoadTestParam<T>): Promise<void> => {
  const timeFn = async (i: number): Promise<TimedRun<T>> => {
    const startTime = new Date().getTime()
    const result = await fn()
    const endTime = new Date().getTime()
    return {
      i,
      name,
      qps,
      timeMs: endTime - startTime,
      result,
    }
  }

  const delayMs = 1000 / qps
  const repetitions = (qps * durationMs) / 1000
  const results = await setNIntervals(timeFn, delayMs, repetitions)
  if (newlineDelimited ?? false) {
    await fs.promises.writeFile(
      filename,
      results.map((x) => JSON.stringify(x)).join('\n')
    )
  } else {
    fs.promises.writeFile(filename, JSON.stringify(results, null, '\t'))
  }
}
