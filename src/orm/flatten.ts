import { ObjectId, WithId } from 'mongodb'
import { NonArrayObject } from './common'

export declare type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string

export declare type NestedPaths<Type, ArrayIndexType> = Type extends
  | string
  | number
  | boolean
  | Date
  | RegExp
  | Buffer
  | Uint8Array
  | ObjectId
  | {
      _bsontype: string
    }
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? ArrayType extends NonArrayObject
    ? // Can omit index for array of objects
      // https://docs.mongodb.com/manual/tutorial/query-array-of-documents/#combination-of-elements-satisfies-the-criteria
      | NestedPaths<ArrayType, ArrayIndexType>
        | [ArrayIndexType, ...NestedPaths<ArrayType, ArrayIndexType>]
        | [ArrayIndexType] // Can stop at array
    :
        | [ArrayIndexType, ...NestedPaths<ArrayType, ArrayIndexType>]
        | [ArrayIndexType] // Can stop at array
  : Type extends Map<string, unknown>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]:
        | [Key, ...NestedPaths<Type[Key], ArrayIndexType>]
        | [Key]
    }[Extract<keyof Type, string>]
  : []

export declare type FlattenFilterPaths<Type> = Join<
  NestedPaths<WithId<Type>, number>,
  '.'
>

export declare type FlattenUpdatePaths<Type> = Join<
  NestedPaths<WithId<Type>, number>,
  '$' | '$[]'
>

type _FlattenType<Schema, Property extends string> = string extends Property
  ? never
  : Property extends keyof Schema
  ? Schema extends NonArrayObject
    ? Schema[Property]
    : never
  : Property extends `${number}`
  ? Schema extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : never
  : Property extends `${infer Key}.${infer Rest}`
  ? Key extends `${number}`
    ? Schema extends ReadonlyArray<infer ArrayType>
      ? _FlattenType<ArrayType, Rest>
      : never
    : Key extends keyof Schema
    ? _FlattenType<Schema[Key], Rest>
    : never
  : Schema extends ReadonlyArray<infer ArrayType> // Can omit index for array of objects
  ? ArrayType extends NonArrayObject
    ? _FlattenType<ArrayType, Property>
    : never
  : never

export declare type FlattenType<Schema, Property extends string> = _FlattenType<
  WithId<Schema>,
  Property
>
