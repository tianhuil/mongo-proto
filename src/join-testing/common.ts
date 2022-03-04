import { Db, ObjectId } from 'mongodb'
import { mkDbFactory } from '../common'
import { mkTsCollection } from '../ts-mongodb'

// Exploring performance of one-to-few, one-to-many, and one-to-squillions joins
// https://www.mongodb.com/developer/article/mongodb-schema-design-best-practices/

export interface PostBase {
  title: string
  text: string
  date: Date
}
export interface UserBase {
  name: string
  nickName?: string
  rating: number
  date?: Date
  contact: {
    email: string
    phone?: string
  }
}

// one-to-few
export interface PostA extends PostBase {}
export interface UserA extends UserBase {
  posts: PostA[]
}

// one-to-many
export interface PostB extends PostBase {}
export interface UserB extends UserBase {
  postIds: ObjectId[]
}

// one-to-squillions joins
export interface PostC extends PostBase {
  userId: ObjectId
}
export interface UserC extends UserBase {}

const mkTsCollections = (db: Db) => ({
  postA: mkTsCollection<PostA>(db, 'join-testing-user-A'),
  userA: mkTsCollection<UserA>(db, 'join-testing-user-A'),
  postB: mkTsCollection<PostB>(db, 'join-testing-user-B'),
  userB: mkTsCollection<UserB>(db, 'join-testing-user-B'),
  postC: mkTsCollection<PostC>(db, 'join-testing-user-C'),
  userC: mkTsCollection<UserC>(db, 'join-testing-user-C'),
})

export const mkDb = () => mkDbFactory(mkTsCollections)
