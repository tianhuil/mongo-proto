import { Document } from 'mongodb'
import { FlattenUpdatePaths, FlattenUpdateType } from './flatten'

export declare type Update<Schema extends Document> = {
  $max?: UpdateFlattenTypes<Schema, number | Date>
  $inc?: UpdateFlattenTypes<Schema, number>
  $mul?: UpdateFlattenTypes<Schema, number>
  $min?: UpdateFlattenTypes<Schema, number | Date>
  $currentDate?: UpdateFlattenTypes<Schema, Date>

  // Array methods
  $push?: UpdateFlattenTypes<Schema, Array<unknown>>
  $pop?: UpdateFlattenTypes<Schema, Date>
}

export declare type SelectFlattenUpdatePaths<TSchema, KeepType> = {
  readonly [Property in FlattenUpdatePaths<TSchema>]: Property extends string
    ? FlattenUpdateType<TSchema, Property> extends KeepType
      ? Property
      : never
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
  >]?: Property extends string
    ? FlattenUpdateType<TSchema, Property> extends KeepType
      ? unknown extends AssignType
        ? FlattenUpdateType<TSchema, Property>
        : AssignType
      : never
    : never
}

// export declare type UpdateFilter<TSchema> = {
//   $currentDate?: OnlyFieldsOfType<
//     TSchema,
//     Date | Timestamp,
//     | true
//     | {
//         $type: 'date' | 'timestamp'
//       }
//   >
//   $inc?: OnlyFieldsOfType<TSchema, NumericType | undefined>
//   $min?: MatchKeysAndValues<TSchema>
//   $max?: MatchKeysAndValues<TSchema>
//   $mul?: OnlyFieldsOfType<TSchema, NumericType | undefined>
//   $rename?: Record<string, string>
//   $set?: MatchKeysAndValues<TSchema>
//   $setOnInsert?: MatchKeysAndValues<TSchema>
//   $unset?: OnlyFieldsOfType<TSchema, any, '' | true | 1>
//   $addToSet?: SetFields<TSchema>
//   $pop?: OnlyFieldsOfType<TSchema, ReadonlyArray<any>, 1 | -1>
//   $pull?: PullOperator<TSchema>
//   $push?: PushOperator<TSchema>
//   $pullAll?: PullAllOperator<TSchema>
//   $bit?: OnlyFieldsOfType<
//     TSchema,
//     NumericType | undefined,
//     | {
//         and: IntegerType
//       }
//     | {
//         or: IntegerType
//       }
//     | {
//         xor: IntegerType
//       }
//   >
// }

// export declare type MatchKeysAndValues<TSchema> = Readonly<Partial<TSchema>> &
//   Record<string, any>

// export declare type OnlyFieldsOfType<
//   TSchema,
//   FieldType = any,
//   AssignableType = FieldType
// > = IsAny<
//   TSchema[keyof TSchema],
//   Record<string, FieldType>,
//   AcceptedFields<TSchema, FieldType, AssignableType> &
//     NotAcceptedFields<TSchema, FieldType> &
//     Record<string, AssignableType>
// >
