import { Document } from 'mongodb'
import { TsCollection } from './connection'

export declare type FuncType = (...args: any[]) => any

export declare type MethodKeys<T> = {
  [M in keyof T]: T[M] extends FuncType ? M : never
}[keyof T]

export declare type Methods<T> = {
  [M in MethodKeys<T>]: T[M] extends FuncType ? T[M] : never
}

export const middlewareMethods = [
  // Database operations
  'insertOne',
  'insertMany',
  'bulkWrite',
  'updateOne',
  'replaceOne',
  'updateMany',
  'deleteOne',
  'deleteMany',
  'rename',
  'drop',
  'findOne',
  'find',
  'estimatedDocumentCount',
  'countDocuments',
  'distinct',
  'findOneAndDelete',
  'findOneAndReplace',
  'findOneAndUpdate',
  'aggregate',
  'watch',
  'mapReduce',
  'initializeUnorderedBulkOp',
  'initializeOrderedBulkOp',
  'insert',
  'update',
  'remove',
  'count',

  // house-keeping operations
  'createIndex',
  'createIndexes',
  'dropIndex',
  'dropIndexes',
  'listIndexes',
  'indexExists',
  'indexInformation',
  'indexes',
  'stats',
] as const

export type MiddlewareMethods = typeof middlewareMethods[number]

export const isMiddlewareMethod = (
  methodName: string
): methodName is MiddlewareMethods => {
  return middlewareMethods.includes(methodName as MiddlewareMethods)
}

export interface Context<
  TSchema,
  Key extends MethodKeys<TsCollection<TSchema>>
> {
  originalMethod: TsCollection<TSchema>[Key]
}

export type Handler<
  TSchema extends Document,
  // NB: need MethodKeys<TsCollection<TSchema>> because typescript is not smart enough to infer from just MiddlewareMethods
  K extends MethodKeys<TsCollection<TSchema>>
> = (ctx: Context<TSchema, K>) => TsCollection<TSchema>[K]

export type Handlers<TSchema extends Document> = {
  [K in MethodKeys<TsCollection<TSchema>>]: Handler<TSchema, K>
}

export type Middleware<
  TSchema extends Document,
  K extends MethodKeys<TsCollection<TSchema>>
> = Handlers<TSchema>[K]
