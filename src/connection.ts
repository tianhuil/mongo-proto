import { Collection, CollectionOptions, Db, Document } from 'mongodb'
import {
  Context,
  Handler,
  isMiddlewareMethod,
  MethodKeys,
  MiddlewareMethods,
} from './middleware'
import { RemodelType, SafeCollection } from './types'

export declare type TsCollection<TSchema extends Document> = RemodelType<
  SafeCollection<TSchema> & { unsafe: Collection<TSchema> },
  Collection<TSchema>
>

export declare interface TsCollectionOptions<
  TSchema extends Document,
  K extends MethodKeys<TsCollection<TSchema>> = MiddlewareMethods
> extends CollectionOptions {
  handler?: Handler<TSchema, K>
}

/**
 *
 * @param db mongodb
 * @param name name of collection
 * @param options collection
 * @returns
 */
export const mkTsCollection = <TSchema extends Document>(
  db: Db,
  name: string,
  options?: TsCollectionOptions<TSchema, MiddlewareMethods>
) => collectionProxy<TSchema>(db, name, true, options) as TsCollection<TSchema>

const collectionProxy = <TSchema extends Document>(
  db: Db,
  name: string,
  withUnsafe: boolean,
  options?: TsCollectionOptions<TSchema, MiddlewareMethods>
): Collection<TSchema> | TsCollection<TSchema> =>
  new Proxy(db.collection<TSchema>(name, options), {
    get(target, property: string) {
      if (withUnsafe && property === 'unsafe') {
        return collectionProxy<TSchema>(
          db,
          name,
          false,
          options
        ) as Collection<TSchema>
      }

      const handler = options?.handler
      if (isMiddlewareMethod(property) && handler) {
        const context = {
          originalMethod: target[property],
        } as Context<TSchema, MiddlewareMethods>
        return handler(context)
      }

      return target[property as keyof typeof target]
    },
  }) as unknown as TsCollection<TSchema>
