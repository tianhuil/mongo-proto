import { Document, WithId } from 'mongodb'
import { DotPaths } from '../ts-mongodb'

export type RecurPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, any> ? RecurPartial<T[P]> : T[P]
}

/**
 * Array extends Document so need a document that does not match an Array
 * However, must also extend Document for `Schema[Property]` to be valid
 */
export type NonArrayObject = {
  [x: string]: any
  [y: number]: never
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
      $all?: T extends NonArrayObject
        ? (T | { $elemMatch: WithOperator<T> })[]
        : T[]
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

export type WithRecordOperator<Schema> = Schema extends NonArrayObject
  ?
      | {
          [Property in keyof WithId<Schema>]?: WithOperator<Schema[Property]>
        }
      | {
          [Property in DotPaths<Schema>]?: FilterType<Schema, Property>
        }
  : {}

export type WithOperator<Field> =
  | RecurPartial<Field>
  | WithNegatableOperator<
      WithElementOperator &
        WithRecordOperator<Field> &
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

/**
 * The type for a given dot path into a json object
 */
export declare type FilterType<
  Schema,
  Property extends string
> = string extends Property
  ? unknown
  : Property extends keyof Schema
  ? Schema extends NonArrayObject
    ? WithOperator<Schema[Property]>
    : unknown
  : Property extends `${number}`
  ? Schema extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : unknown
  : Property extends `${infer Key}.${infer Rest}`
  ? Key extends `${number}`
    ? Schema extends ReadonlyArray<infer ArrayType>
      ? FilterType<ArrayType, Rest>
      : unknown
    : Key extends keyof Schema
    ? Schema[Key] extends NonArrayObject
      ? FilterType<Schema[Key], Rest>
      : unknown
    : unknown
  : unknown

export type Filter<Schema extends Document> =
  | WithLogicalOperators<WithOperator<Schema>>
  | WithOperator<Schema>
