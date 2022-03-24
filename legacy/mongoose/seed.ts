import { connect } from 'mongoose'
import { UserModel } from './schema'

run().catch((err) => console.log(err))

async function run(): Promise<void> {
  // 4. Connect to MongoDB
  const db = await connect(process.env.MONGO_URL || '')

  try {
    const doc = new UserModel({
      name: 'Bill',
      avatar: 'https://i.imgur.com/dM7Thhn.png',
      address: {
        street: 'hi',
        city: 'foo',
        state: 'bow',
      },
    })
    await doc.save()
    UserModel.findByIdAndUpdate(doc.id, {
      $set: {
        'address.city': 'hi',
      },
    })
  } finally {
    db.disconnect()
  }
}
