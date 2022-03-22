import { Db, Document, MongoClient, ObjectId } from 'mongodb'
import { TsCollection } from './ts-mongodb'

export const mkDbFactory = <T>(mkTsCollections: (db: Db) => T) => {
  return (uri?: string) => {
    const _uri = uri ?? process.env.MONGO_URL ?? ''
    const client = new MongoClient(_uri)
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

export const fetchIds = async <T extends Document>(
  coll: TsCollection<T>
): Promise<ObjectId[]> => {
  const results = await coll.find({}).project({ _id: 1 })

  return results.map((x) => x._id as ObjectId).toArray()
}

// https://stackoverflow.com/a/62099607/8930600
export declare type Strict<T extends Record<string, any>> = T & {
  [K in ExcludedKeys<T & string>]: never
}

type ExcludedKeys<ExcludedLiterals extends string> = keyof Omit<
  { [Key in string]: never },
  ExcludedLiterals
>

type Impossible<K extends keyof any> = {
  [P in K]: never
}

type NoExtraProperties<T, U extends T = T> = U &
  Impossible<Exclude<keyof U, keyof T>>
