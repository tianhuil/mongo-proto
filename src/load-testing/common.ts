import { MongoClient, ObjectId, WithId } from 'mongodb'
import { mkTsCollection, TsCollection } from '../ts-mongodb'

export interface Post {
  authorId: ObjectId
  title: string
  text: string
  date: Date
}

export interface CreditCard {
  number: string
  cvv: string
  expiration: Date
}

export interface User {
  name: string
  nickName?: string
  rating: number
  date?: Date
  contact: {
    email: string
    phone?: string
  }
  creditCards: CreditCard[]
}

interface TsCollections {
  post: TsCollection<Post>
  user: TsCollection<User>
}

export const mkDb = () => {
  const uri = process.env.MONGO_URL || ''
  const client = new MongoClient(uri)
  const dbName = 'test'
  const db = client.db(dbName)

  const collections: TsCollections = {
    post: mkTsCollection<Post>(db, 'loading-test-post'),
    user: mkTsCollection<User>(db, 'loading-test-user'),
  }

  return {
    connect: () => client.connect(),
    close: () => client.close(),
    withDb: (
      fn: (collections: TsCollections) => Promise<void>
    ): Promise<void> => {
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

export const fetchAuthorIds = async (
  user: TsCollection<User>
): Promise<ObjectId[]> => {
  const userResults = await user
    .find({})
    .project<Pick<WithId<User>, '_id'>>({ _id: 1 })

  return userResults.map((x) => x._id).toArray()
}
