import { createSchema, Type, typedModel } from 'ts-mongoose'

export const AddressSchema = createSchema({
  street: Type.string({ required: true }),
  city: Type.string({ required: true }),
  state: Type.string({ required: true }),
})

export const UserSchema = createSchema({
  name: Type.string({ required: true, alias: 'nameAlias' }),
  email: Type.string({ required: true }),
  avatar: Type.string(),
  address: Type.schema({ required: true, alias: 'addressAlias' }).of(
    AddressSchema
  ),
})

// 3. Create a Model.
export const UserModel = typedModel('User', UserSchema)
