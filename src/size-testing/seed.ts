import faker from '@faker-js/faker'
import { BlobStr, mkDb, sizes } from './common'

const numBlob = 100

const newBlob = (size: number): BlobStr => ({
  size,
  text: faker.lorem.paragraphs(size),
})

const main = async () => {
  const db = mkDb()
  await db.withDb(async ({ blobStr }) => {
    await blobStr.deleteMany({})

    await blobStr.insertMany(
      sizes.flatMap((size) =>
        Array(numBlob)
          .fill(null)
          .map(() => newBlob(size))
      )
    )

    await blobStr.createIndex({ size: 1 })
  })
}

main()
