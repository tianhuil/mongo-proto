import { ObjectId, WithId } from 'mongodb'
import { NonArrayObject } from './common'

export declare type FlattenFilterPaths<Type> = Join<
  NestedPaths<WithId<Type>, number>,
  '.'
>

// Do not allow numeric index because that weakens type-checking
// (the resulting template literal does not check for extra keys)
type UpdateArrayHolder = '$' | '$[]'

export declare type FlattenUpdatePaths<Type> = Join<
  NestedPaths<WithId<Type>, UpdateArrayHolder>,
  '.'
>

export declare type FlattenFilterType<
  Schema,
  Property extends string
> = _FlattenFilterType<WithId<Schema>, Property, `${number}`>

export declare type FlattenUpdateType<
  Schema,
  Property extends string
> = _FlattenFilterType<WithId<Schema>, Property, UpdateArrayHolder>

declare type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string

declare type NestedPaths<Type, ArrayIndexType> = Type extends
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

declare type _FlattenFilterType<
  Schema,
  Property extends string,
  ArrayHolder extends string
> = string extends Property
  ? never
  : Property extends keyof Schema
  ? Schema extends NonArrayObject
    ? Schema[Property]
    : never
  : Property extends ArrayHolder
  ? Schema extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : never
  : Property extends `${infer Key}.${infer Rest}`
  ? Key extends ArrayHolder
    ? Schema extends ReadonlyArray<infer ArrayType>
      ? _FlattenFilterType<ArrayType, Rest, ArrayHolder>
      : never
    : Key extends keyof Schema
    ? _FlattenFilterType<Schema[Key], Rest, ArrayHolder>
    : never
  : Schema extends ReadonlyArray<infer ArrayType> // Can omit index for array of objects
  ? ArrayType extends NonArrayObject
    ? _FlattenFilterType<ArrayType, Property, ArrayHolder>
    : never
  : never
