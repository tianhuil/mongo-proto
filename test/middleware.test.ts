import { addMiddleware } from '../src'
import { mkTsTestCollection } from './util'

type Example = { a: number }

const mkListeningCollection = async () => {
  const col = await mkTsTestCollection<Example>()

  const [before, after] = [jest.fn(), jest.fn()]
  addMiddleware(col, {
    handler:
      ({ originalMethod }) =>
      (...args) => {
        before()
        const result = originalMethod(...args)
        after()
        return result
      },
  })

  return { col, before, after }
}

test('test listening on insertOne', async () => {
  const { col, before, after } = await mkListeningCollection()

  await col.insertOne({ a: 2 })
  expect(before).toHaveBeenCalledTimes(1)
  expect(after).toHaveBeenCalledTimes(1)
})

test('test listening on find', async () => {
  const { col, before, after } = await mkListeningCollection()

  for await (const x of col.find({})) {
  }
  expect(before).toHaveBeenCalledTimes(1)
  expect(after).toHaveBeenCalledTimes(1)
})
