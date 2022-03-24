import faker from '@faker-js/faker'
import { BlobStr, BlobStrArr, mkDb, sizes } from './common'

const numBlob = 100

const newBlobStr = (size: number): BlobStr => ({
  size,
  text: faker.lorem.paragraphs(size),
})

const newBlobStrArr = (size: number): BlobStrArr => ({
  size,
  texts: faker.lorem.paragraphs(size, '\n').split('\n'),
})

const main = async () => {
  const db = mkDb()
  await db.withDb(async ({ blobStr, blobStrArr }) => {
    await blobStr.deleteMany({})
    await blobStr.insertMany(
      sizes.flatMap((size) =>
        Array(numBlob)
          .fill(null)
          .map(() => newBlobStr(size))
      )
    )
    await blobStr.createIndex({ size: 1 })

    await blobStrArr.deleteMany({})
    await blobStrArr.insertMany(
      sizes.flatMap((size) =>
        Array(numBlob)
          .fill(null)
          .map(() => newBlobStrArr(size))
      )
    )
    await blobStrArr.createIndex({ size: 1 })
  })
}

main()
