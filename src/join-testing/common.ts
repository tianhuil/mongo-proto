import faker from '@faker-js/faker'
import { Db, ObjectId, WithId } from 'mongodb'
import { mkDbFactory, randomInt } from '../common'
import { mkTsCollection } from '../ts-mongodb'

// Exploring performance of one-to-few, one-to-many, and one-to-squillions joins
// https://www.mongodb.com/developer/article/mongodb-schema-design-best-practices/

interface SeedParams {
  numUsers: number
  maxPostsPerAuthor: number
  minPostsPerAuthor: number
}

export interface PostBase {
  title: string
  text: string
  date: Date
  rating: number
}
export interface UserBase {
  name: string
  nickName?: string
  date?: Date
  contact: {
    email: string
    phone?: string
  }
}

// one-to-few
export interface PostA extends PostBase {
  _id: ObjectId
}
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
  postA: mkTsCollection<PostA>(db, 'join-testing-post-A'),
  userA: mkTsCollection<UserA>(db, 'join-testing-user-A'),
  postB: mkTsCollection<PostB>(db, 'join-testing-post-B'),
  userB: mkTsCollection<UserB>(db, 'join-testing-user-B'),
  postC: mkTsCollection<PostC>(db, 'join-testing-post-C'),
  userC: mkTsCollection<UserC>(db, 'join-testing-user-C'),
  updatePostA(userId: ObjectId, postId: ObjectId) {
    // TODO: make this safe
    return this.userA.unsafe.updateOne(
      { _id: userId, posts: { $elemMatch: { _id: postId } } },
      { $inc: { 'posts.$.rating': 1 } }
    )
  },
  updatePostB(postId: ObjectId) {
    return this.postB.updateOne(
      { _id: postId },
      { $inc: { rating: 1 } } // TODO: rating can be anything
    )
  },
  updatePostC(postId: ObjectId) {
    return this.postC.updateOne({ _id: postId }, { $inc: { rating: 1 } })
  },
  createPostA(userId: ObjectId, post: PostA) {
    return this.userA.updateOne({ _id: userId }, { $push: { posts: post } })
  },
  createPostB(userId: ObjectId, post: WithId<PostB>) {
    return Promise.all([
      this.userB.updateOne({ _id: userId }, { $push: { postIds: post._id } }),
      this.postB.insertOne(post),
    ])
  },
  createPostC(post: PostC) {
    return this.postC.insertOne(post)
  },
  async seedA({ numUsers, maxPostsPerAuthor, minPostsPerAuthor }: SeedParams) {
    return this.userA.insertMany(
      Array(numUsers)
        .fill(null)
        .map(() => ({
          ...newUser(),
          posts: Array(randomInt(minPostsPerAuthor, maxPostsPerAuthor))
            .fill(null)
            .map(newIdPost),
        }))
    )
  },
  async seedB({ numUsers, maxPostsPerAuthor, minPostsPerAuthor }: SeedParams) {
    // B
    const postResults = await Promise.all(
      Array(numUsers)
        .fill(null)
        .map(() =>
          this.postB.insertMany(
            Array(randomInt(minPostsPerAuthor, maxPostsPerAuthor))
              .fill(null)
              .map(newPost)
          )
        )
    )
    const postIdz = postResults.map((result) =>
      Object.values(result.insertedIds)
    )
    const userResults = await this.userB.insertMany(
      postIdz.map((postIds) => ({ ...newUser(), postIds }))
    )
    return [userResults, postResults] as const
  },
  async seedC({ numUsers, maxPostsPerAuthor, minPostsPerAuthor }: SeedParams) {
    const usersResult = await this.userC.insertMany(
      Array(numUsers).fill(null).map(newUser)
    )
    const userIds = Object.values(usersResult.insertedIds)

    const postResults = await this.postC.insertMany(
      userIds.flatMap((userId) =>
        Array(randomInt(minPostsPerAuthor, maxPostsPerAuthor))
          .fill(null)
          .map(() => ({ ...newPost(), userId }))
      )
    )
    return [usersResult, postResults] as const
  },
})

export const mkDb = mkDbFactory(mkTsCollections)

export const newUser = (): UserBase => ({
  name: faker.name.findName(),
  contact: { email: faker.internet.email() },
})

export const newPost = (): PostBase => ({
  text: faker.lorem.sentence(),
  rating: randomInt(100),
  title: faker.lorem.words(randomInt(100)),
  date: faker.date.past(5),
})

export const newIdPost = (): PostBase & { _id: ObjectId } => ({
  ...newPost(),
  _id: new ObjectId(),
})
