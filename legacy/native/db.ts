import { MongoClient, ObjectId } from 'mongodb'

export interface Post {
  authorId: ObjectId
  title: string
  text: string
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
}

export const mkDb = (uri?: string) => {
  const client = new MongoClient(uri ?? process.env.MONGO_URL ?? '')
  const dbName = 'test'
  const db = client.db(dbName)
  return {
    connect: () => client.connect(),
    close: () => client.close(),
    post: db.collection<Post>('post'),
    user: db.collection<User>('user'),
  }
}
