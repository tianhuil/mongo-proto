import { connect } from 'mongoose'
import { createSchema, Type, typedModel } from 'ts-mongoose'

const AddressSchema = createSchema({
  street: Type.string({ required: true }),
  city: Type.string({ required: true }),
  state: Type.string({ required: true, abcd: false }),
})

const UserSchema = createSchema({
  name: Type.string({ required: true }),
  email: Type.string({ required: true }),
  avatar: Type.string(),
  address: Type.schema({ required: true }).of(AddressSchema),
})

// 3. Create a Model.
const UserModel = typedModel('User', UserSchema)

run().catch((err) => console.log(err))

async function run(): Promise<void> {
  // 4. Connect to MongoDB
  const db = await connect(process.env.MONGO_URL || '')

  try {
    const doc = new UserModel({
      name: 'Bill',
      email: 'bill@initech.com',
      avatar: 'https://i.imgur.com/dM7Thhn.png',
    })
    await doc.save()
  } finally {
    db.disconnect()
  }
}
