import { Collection, CollectionOptions, Db, Document } from 'mongodb'
import { RemodelType, SafeCollection } from './types'

export declare type TsCollection<TSchema extends Document> = RemodelType<
  SafeCollection<TSchema> & { unsafe: Collection<TSchema> },
  Collection<TSchema>
>

/**
 *
 * @param db mongodb
 * @param name name of collection
 * @param options collection
 * @returns
 */
export const mkTsCollection = <TSchema extends Document = Document>(
  db: Db,
  name: string,
  options?: CollectionOptions
) =>
  new Proxy(db.collection<TSchema>(name, options), {
    get(target, property: string) {
      if (property === 'unsafe') {
        return target
      }
      return target[property as keyof typeof target]
    },
  }) as unknown as TsCollection<TSchema>
