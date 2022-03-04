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

export const randomInt = (max: number): number =>
  Math.floor(Math.random() * max)
export const choose = <T>(array: T[]): T => array[randomInt(array.length)]
