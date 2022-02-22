import { MongoClient, ObjectId } from 'mongodb'
import { mkTsCollection } from '../ts-mongodb'

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

export const mkDb = () => {
  const uri = process.env.MONGO_URL || ''
  const client = new MongoClient(uri)
  const dbName = 'test'
  const db = client.db(dbName)
  return {
    connect: () => client.connect(),
    close: () => client.close(),
    post: mkTsCollection<Post>(db, 'loading-test-post'),
    user: mkTsCollection<User>(db, 'loading-test-user'),
  }
}
