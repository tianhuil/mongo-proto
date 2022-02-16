import { mkDb } from './db'

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()
    console.log(
      'created index ',
      await db.post.createIndex({ title: 'text', text: 'text' })
    )

    // Create Records
    const result = await db.user.insertOne({
      name: 'Charlie',
      rating: 2,
      contact: { email: 'bob@example.com' },
    })

    const authorId = result.insertedId

    await db.post.insertMany([
      { title: 'Nuclear Physics', text: 'Music Awards', authorId },
      { title: 'Computer Science', text: 'Math Awards', authorId },
      { title: 'Mathematical Physics', text: 'Mystery Ideas', authorId },
    ])
  } catch (e) {
    console.log(e)
  } finally {
    db.close()
  }
}

main()
