import { Document } from 'mongodb'
import { FlattenFilterPaths, FlattenType } from './flatten'

export declare type Update<Schema extends Document> = {
  $max?: FilterFlattenTypes<Schema, number | Date>
  $inc?: FilterFlattenTypes<Schema, number>
  $mul?: FilterFlattenTypes<Schema, number>
  $min?: FilterFlattenTypes<Schema, number | Date>
  $currentDate?: FilterFlattenTypes<Schema, Date>
}

export declare type FilterFlattenPaths<TSchema, KeepType> = {
  readonly [Property in FlattenFilterPaths<TSchema>]: Property extends string
    ? FlattenType<TSchema, Property> extends KeepType
      ? Property
      : never
    : never
}[FlattenFilterPaths<TSchema>]

export declare type FilterFlattenTypes<TSchema, KeepType> = {
  readonly [Property in FilterFlattenPaths<
    TSchema,
    KeepType
  >]?: Property extends string
    ? FlattenType<TSchema, Property> extends KeepType
      ? FlattenType<TSchema, Property>
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
