import {
  Collection as OrigCollection,
  CollectionOptions,
  Db,
  Document,
} from 'mongodb'
import { Collection } from './type'
export * from './type'

export interface TsCollection<T> extends Collection<T> {
  unsafe: OrigCollection<T>
}

export const mkTsCollection = <TSchema extends Document = Document>(
  db: Db,
  name: string,
  options?: CollectionOptions
) =>
  new Proxy(db.collection<TSchema>(name, options), {
    get(target, property: string) {
      if (property === 'unsafe') {
        return target
      } else {
        return target[property as keyof typeof target]
      }
    },
  }) as unknown as TsCollection<TSchema>
