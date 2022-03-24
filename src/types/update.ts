import { Document, Timestamp } from 'mongodb'
import { WithOperator } from './filter'
import {
  FlattenFilterPaths,
  FlattenFilterType,
  FlattenUpdatePaths,
  FlattenUpdateType,
} from './flatten'
import { Sort } from './sort'

export declare type Update<Schema extends Document> = {
  // General operators
  $set?: UpdateFlattenTypes<Schema, unknown>
  $setOnInsert?: UpdateFlattenTypes<Schema, unknown>
  $unset?: UpdateFlattenTypes<Schema, unknown, '' | true | 1>

  // Comparison operators
  $inc?: UpdateFlattenTypes<Schema, number>
  $mul?: UpdateFlattenTypes<Schema, number>
  $max?: UpdateFlattenTypes<Schema, number | Date | Timestamp>
  $min?: UpdateFlattenTypes<Schema, number | Date | Timestamp>
  $currentDate?: UpdateFlattenTypes<
    Schema,
    Date | Timestamp,
    true | { $type: 'timestamp' | 'date' }
  >

  // Add array operators
  $push?: UpdateFlattenArrayTypes<Schema>
  $addToSet?: UpdateFlattenArrayTypes<Schema> // https://docs.mongodb.com/manual/reference/operator/update/addToSet/

  // Remove array elements
  $pull?: PullTypes<Schema>
  $pullAll?: PullAllTypes<Schema>
  $pop?: UpdateFlattenArrayTypes<Schema, -1 | 1>
}

// Select for UpdatePaths
export declare type SelectFlattenUpdatePaths<TSchema, KeepType> = {
  readonly [Property in FlattenUpdatePaths<TSchema>]: FlattenUpdateType<
    TSchema,
    Property
  > extends KeepType
    ? Property
    : never
}[FlattenUpdatePaths<TSchema>]

export declare type UpdateFlattenTypes<
  TSchema,
  KeepType,
  AssignType = unknown
> = {
  readonly [Property in SelectFlattenUpdatePaths<
    TSchema,
    KeepType
  >]?: FlattenUpdateType<TSchema, Property> extends KeepType
    ? unknown extends AssignType
      ? FlattenUpdateType<TSchema, Property>
      : AssignType
    : never
}

// Update Array types using Filter dot notation
export declare type SelectFlattenFilterPaths<TSchema, KeepType> = {
  readonly [Property in FlattenFilterPaths<TSchema>]: FlattenFilterType<
    TSchema,
    Property
  > extends KeepType
    ? Property
    : never
}[FlattenFilterPaths<TSchema>]

export declare type PullTypes<TSchema> = {
  readonly [Property in SelectFlattenFilterPaths<
    TSchema,
    Array<unknown>
  >]?: FlattenFilterType<TSchema, Property> extends Array<infer ArrayType>
    ? WithOperator<ArrayType>
    : never
}

export declare type PullAllTypes<TSchema> = {
  readonly [Property in SelectFlattenFilterPaths<
    TSchema,
    Array<unknown>
  >]?: FlattenFilterType<TSchema, Property> extends Array<unknown>
    ? FlattenFilterType<TSchema, Property>
    : never
}

// Update Array types using Update dot notation
export declare type UpdateFlattenArrayTypes<TSchema, AssignType = unknown> = {
  readonly [Property in SelectFlattenUpdatePaths<
    TSchema,
    Array<unknown>
  >]?: FlattenUpdateType<TSchema, Property> extends Array<infer ArrayType>
    ? unknown extends AssignType
      ? ArrayAssignType<ArrayType>
      : AssignType
    : never
}

export declare type ArrayAssignType<T> =
  | T
  | {
      $each: ReadonlyArray<T>
      $position?: number
      $slice?: number
      $sort?: Sort<T>
    }
