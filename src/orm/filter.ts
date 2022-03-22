import { Document, WithId } from 'mongodb'
import { NonArrayObject, RecurPartial } from './common'
import { FlattenFilterPaths, FlattenType } from './flatten'

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
          [Property in FlattenFilterPaths<Schema>]?: FilterType<
            Schema,
            Property
          >
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
 * NB: must be maintained as a separate type function
 */
export declare type FilterType<Schema, Property extends string> = WithOperator<
  FlattenType<Schema, Property>
>

export type Filter<Schema extends Document> =
  | WithLogicalOperators<WithOperator<Schema>>
  | WithOperator<Schema>
