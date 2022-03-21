import { Document } from 'mongodb'
import { DotPaths } from '../ts-mongodb'

type RecurPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, any> ? RecurPartial<T[P]> : T[P]
}

/**
 * https://docs.mongodb.com/manual/reference/operator/query-element/
 */
export type WithElementOperator = {
  $exists?: boolean
  $type?: 'double' | 'string' | 'objectId' | 'array' | 'bool' | 'date' | 'regex'
}

/**
 * https://docs.mongodb.com/manual/reference/operator/query-comparison/
 */
export type WithComparisonOperator<Field> = {
  $eq?: Field
  $ne?: Field
  $in?: Field[]
  $nin?: Field[]
}

export type WithNumericOperator<Field> = Field extends number
  ? {
      $gt?: number
      $lt?: number
      $gte?: number
      $lte?: number
    }
  : {}

/**
 * https://docs.mongodb.com/manual/reference/operator/query/regex/
 * Does not include $option because it is covered by RegExp
 */
export type WithStringOperator<Field> = Field extends string
  ? {
      $regex?: RegExp | string
      $text?: {
        $search: string
        $language?: string
        $caseSensitive?: boolean
        $diacriticSensitive?: boolean
      }
    }
  : {}

/**
 * https://docs.mongodb.com/manual/reference/operator/query/all/
 */
export type WithArrayOperator<Field> = Field extends ReadonlyArray<infer T>
  ? {
      $all?: T extends Document ? { $elemMatch: _RawFilter<T> }[] : T[]
      $size?: number
    }
  : {}

/**
 * https://docs.mongodb.com/manual/reference/operator/query/not/
 */
export type WithNegatableOperator<Expr> =
  | {
      $not: Expr
    }
  | Expr

export type WithOperator<Field> =
  | RecurPartial<Field>
  | WithNegatableOperator<
      WithElementOperator &
        WithComparisonOperator<Field> &
        WithStringOperator<Field> &
        WithNumericOperator<Field> &
        WithArrayOperator<Field>
    >

/**
 * https://docs.mongodb.com/manual/reference/operator/query-logical/
 */
export type WithLogicalOperators<Field> = {
  $and?: Filter<Field>[]
  $or?: Filter<Field>[]
  $nor?: Filter<Field>[]
}

export type _RawFilter<Schema extends Document> =
  | {
      [Property in keyof Schema]?: Schema[Property] extends Document
        ? WithOperator<_RawFilter<Schema[Property]>>
        : WithOperator<Schema[Property]>
    }
  | {
      [Property in DotPaths<Schema>]?: PropertyType<Schema, Property>
    }

/**
 * General formula for dot queries
 */
export declare type PropertyType<
  Schema,
  Property extends string
> = string extends Property
  ? unknown
  : Property extends keyof Schema
  ? Schema extends Document
    ? Schema[Property] extends Document
      ? WithOperator<_RawFilter<Schema[Property]>>
      : WithOperator<Schema[Property]>
    : unknown
  : Property extends `${number}`
  ? Schema extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : unknown
  : Property extends `${infer Key}.${infer Rest}`
  ? Key extends `${number}`
    ? Schema extends ReadonlyArray<infer ArrayType>
      ? PropertyType<ArrayType, Rest>
      : unknown
    : Key extends keyof Schema
    ? Schema[Key] extends Record<string, any>
      ? PropertyType<Schema[Key], Rest>
      : unknown
    : unknown
  : unknown

export type Filter<Schema extends Document> =
  | WithLogicalOperators<_RawFilter<Schema>>
  | _RawFilter<Schema>
