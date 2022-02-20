import { CollectionOptions, Db } from 'mongodb'
import { TsCollection } from './collection'
export * from './collection'

export const mkTsCollection = <TSchema extends Document = Document>(
  db: Db,
  name: string,
  options?: CollectionOptions
) =>
  new Proxy(db.collection<TSchema>(name, options), {
    get(target, property: string) {
      if (property === 'dangerous') {
        return target
      } else {
        return target[property as keyof typeof target]
      }
    },
  }) as unknown as TsCollection<TSchema>
