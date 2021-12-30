import { connect, model, Schema } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
interface User {
  date: Date
  name: string
  email: string
  avatar?: string
  address: {
    street: string
    city: string
    state: string
  }
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<User>({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  address: {
    type: {
      street: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    required: true,
  },
})

// 3. Create a Model.
const UserModel = model<User>('User', schema)

UserModel.aggregate()

run().catch((err) => console.log(err))

async function run(): Promise<void> {
  // 4. Connect to MongoDB
  await connect(process.env.MONGO_URL || '')

  const doc = new UserModel({
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png',
  })
  await doc.save()

  console.log(doc.email) // 'bill@initech.com'
}
