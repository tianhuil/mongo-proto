import { mkDb } from './db'

const main = async () => {
  const db = mkDb()
  try {
    await db.connect()
    const user = await db.user.findOne({})
    if (!user) return null
    Object.defineProperty(user, 'namex', { get: () => user.name })
    return {
      ...user,
      get bob(): string {
        return this.name
      },
    }
  } catch (e) {
    console.log(e)
  } finally {
    db.close()
  }
}

main()
