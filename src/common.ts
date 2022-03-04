import { Db, MongoClient } from 'mongodb'

export const mkDbFactory = <T>(mkTsCollections: (db: Db) => T) => {
  const uri = process.env.MONGO_URL || ''
  const client = new MongoClient(uri)
  const db = client.db()
  const collections = mkTsCollections(db)

  return {
    connect: () => client.connect(),
    close: () => client.close(),
    withDb: (fn: (collections: T) => Promise<void>): Promise<void> => {
      return client
        .connect()
        .then(() => fn(collections))
        .finally(() => client.close())
    },
    ...collections,
  }
}

export function randomInt(max: number): number
export function randomInt(min: number, max: number): number
export function randomInt(...args: number[]): number {
  const parseArgs = (): [number, number] => {
    switch (args.length) {
      case 1:
        return [0, args[0]]
      case 2:
        return [args[0], args[1]]
      default:
        throw Error(`Expected either 1 or two arguments, got ${args.length}`)
    }
  }
  const [min, max] = parseArgs()
  return min + Math.floor(Math.random() * (max - min))
}
export const choose = <T>(array: T[]): T => array[randomInt(array.length)]
