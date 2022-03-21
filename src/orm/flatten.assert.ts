import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { FlattenPaths, FlattenType } from './flatten'

type Example = {
  a: number
  b: {
    c: string
    d: {
      e: boolean
    }
  }
  f: ObjectId[]
  g: {
    h: number
  }[]
}

ta.assert<
  ta.Equal<
    | '_id'
    | 'a'
    | 'b'
    | 'b.c'
    | 'b.d.e'
    | 'b.d'
    | 'f'
    | `f.${number}`
    | 'g'
    | `g.${number}`
    | `g.${number}.h`,
    FlattenPaths<Example>
  >
>()

ta.assert<ta.Equal<FlattenType<Example, '_id'>, ObjectId>>()
ta.assert<ta.Equal<FlattenType<Example, 'a'>, number>>()
ta.assert<
  ta.Equal<FlattenType<Example, 'b'>, { c: string; d: { e: boolean } }>
>()
ta.assert<ta.Equal<FlattenType<Example, 'b.c'>, string>>()
ta.assert<ta.Equal<FlattenType<Example, 'b.d'>, { e: boolean }>>()
ta.assert<ta.Equal<FlattenType<Example, 'b.d.e'>, boolean>>()
ta.assert<ta.Equal<FlattenType<Example, 'b.d'>, { e: boolean }>>()
ta.assert<ta.Equal<FlattenType<Example, 'f'>, ObjectId[]>>()
ta.assert<ta.Equal<FlattenType<Example, 'f.4'>, ObjectId>>()
ta.assert<ta.Equal<FlattenType<Example, 'g'>, { h: number }[]>>()
ta.assert<ta.Equal<FlattenType<Example, 'g.0'>, { h: number }>>()
ta.assert<ta.Equal<FlattenType<Example, 'g.0.h'>, number>>()
