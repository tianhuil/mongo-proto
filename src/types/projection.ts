import { Document } from 'mongodb'
import { WithOperator } from './filter'
import { FlattenFilterPaths, FlattenFilterType } from './flatten'

export declare type ProjectionOperator<Field> = Field extends ReadonlyArray<
  infer ArrayType
>
  ? {
      $elemMatch: WithOperator<ArrayType>
      $slice?: number | [number, number]
    }
  : never

export declare type Projection<TSchema extends Document> =
  | {
      [Property in FlattenFilterPaths<TSchema>]?: Property extends '_id'
        ? 1 | 0 | boolean
        : ProjectionOperator<FlattenFilterType<TSchema, Property>> | 1 | true
    }
  | { [Property in FlattenFilterPaths<TSchema>]?: 0 | false }
