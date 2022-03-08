import { ObjectId, WithId } from 'mongodb'
import { mkDbFactory } from '../common'
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

export const mkDb = mkDbFactory((db) => ({
  post: mkTsCollection<Post>(db, 'loading-test-post'),
  user: mkTsCollection<User>(db, 'loading-test-user'),
}))

export const fetchAuthorIds = async (
  user: TsCollection<User>
): Promise<ObjectId[]> => {
  const userResults = await user
    .find({})
    .project<Pick<WithId<User>, '_id'>>({ _id: 1 })

  return userResults.map((x) => x._id).toArray()
}
