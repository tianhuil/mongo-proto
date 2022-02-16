import { mkDb } from './db'

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()
    console.log('==== Query Physics:')
    await (
      await db.post.find({ $text: { $search: 'physics' } })
    ).forEach((doc) => console.log(doc))

    console.log('==== Query Awards:')
    await (
      await db.post.find({ $text: { $search: 'Awards' } })
    ).forEach((doc) => console.log(doc))
  } catch (e) {
    console.log(e)
  } finally {
    db.close()
  }
}

main()
