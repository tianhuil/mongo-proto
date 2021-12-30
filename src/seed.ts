import { mkDb } from './db'

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()
    const results = await db.user.insertMany([
      {
        name: 'Alice',
        rating: 2,
        nickName: 'A',
        contact: { email: 'alice@example.com', phone: '+1234' },
      },
      { name: 'Bob', rating: 2, contact: { email: 'bob@example.com' } },
    ])

    const aliceId = results.insertedIds[0]
    const bobId = results.insertedIds[1]

    await db.post.insertMany([
      { title: 'a', text: 'a', authorId: aliceId },
      { title: 'b', text: 'b', authorId: aliceId },
      { title: 'c', text: 'c', authorId: bobId },
    ])
  } finally {
    db.close()
  }
}

main()
