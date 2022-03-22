import { ObjectId } from 'mongodb'

export declare type BaseTypes =
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

export declare type RecurPartial<T> = T extends BaseTypes
  ? T
  : T extends ReadonlyArray<infer ArrayType>
  ? ReadonlyArray<RecurPartial<ArrayType>>
  : T extends Record<string, unknown>
  ? {
      readonly [P in keyof T]?: RecurPartial<T[P]>
    }
  : never

/**
 * Array extends Document so need a document that does not match an Array
 * However, must also extend Document for `Schema[Property]` to be valid
 */
export declare type NonArrayObject = {
  readonly [x: string]: unknown
  readonly [y: number]: never
}
