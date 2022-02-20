import { Collection, CollectionOptions, Db, Document } from 'mongodb'

interface TsCollection<TSchema extends Document = Document>
  extends Collection<TSchema> {
  dangeours: Collection<TSchema>
}

export const mkTsCollection = <ICollection>(
  db: Db,
  name: string,
  options?: CollectionOptions
) =>
  new Proxy(db.collection<ICollection>(name, options), {
    get(target, property: string) {
      if (property === 'dangerous') {
        return target
      }
    },
  }) as TsCollection<ICollection>
