import { ObjectId, WithId } from 'mongodb'
import { NonArrayObject } from './common'

export declare type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string

export declare type NestedPaths<Type> = Type extends
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
  ? [number, ...NestedPaths<ArrayType>] | [number]
  : Type extends Map<string, unknown>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]: Type[Key] extends Type
        ? [Key]
        : Type extends Type[Key]
        ? [Key]
        : Type[Key] extends ReadonlyArray<infer ArrayType>
        ? Type extends ArrayType
          ? [Key]
          : ArrayType extends Type
          ? [Key]
          : [Key, ...NestedPaths<Type[Key]>] | [Key]
        : [Key, ...NestedPaths<Type[Key]>] | [Key]
    }[Extract<keyof Type, string>]
  : []

export declare type FlattenPaths<Type> = Join<NestedPaths<WithId<Type>>, '.'>

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
      ? FlattenType<ArrayType, Rest>
      : never
    : Key extends keyof Schema
    ? FlattenType<Schema[Key], Rest>
    : never
  : never

export declare type FlattenType<Schema, Property extends string> = _FlattenType<
  WithId<Schema>,
  Property
>
