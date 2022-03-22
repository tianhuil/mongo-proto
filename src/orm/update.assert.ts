import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { FilterFlattenPaths, FilterFlattenTypes } from './update'

type Example = {
  a: string
  b: {
    c: number
  }
  d: boolean[]
  e: {
    f: ObjectId
  }[]
  g: number
}

// Test FilterFlattenPaths
ta.assert<ta.Equal<'a', FilterFlattenPaths<Example, string>>>()
ta.assert<ta.Not<ta.Equal<'z', FilterFlattenPaths<Example, string>>>>()
ta.assert<ta.Not<ta.Equal<'a', FilterFlattenPaths<Example, number>>>>()
ta.assert<ta.Equal<'b.c' | 'g', FilterFlattenPaths<Example, number>>>()
ta.assert<ta.Equal<'b', FilterFlattenPaths<Example, { c: number }>>>()
ta.assert<ta.Equal<`d.${number}`, FilterFlattenPaths<Example, boolean>>>()
ta.assert<ta.Extends<'d.2', FilterFlattenPaths<Example, boolean>>>()
ta.assert<ta.Not<ta.Extends<'d.x', FilterFlattenPaths<Example, boolean>>>>()
ta.assert<ta.Not<ta.Equal<`d`, FilterFlattenPaths<Example, boolean>>>>()
ta.assert<ta.Not<ta.Equal<`d`, FilterFlattenPaths<Example, boolean>>>>()
ta.assert<
  ta.Equal<'_id' | `e.${number}.f`, FilterFlattenPaths<Example, ObjectId>>
>()

// Test FilterFlattenTypes
ta.assert<ta.Equal<{ a?: string }, FilterFlattenTypes<Example, string>>>()
ta.assert<ta.Extends<{ 'b.c': number }, FilterFlattenTypes<Example, number>>>()
ta.assert<
  ta.Equal<{ 'b.c'?: number; g?: number }, FilterFlattenTypes<Example, number>>
>()
ta.assert<
  ta.Equal<
    { [x in `d.${number}`]: boolean | undefined },
    FilterFlattenTypes<Example, boolean>
  >
>()
ta.assert<ta.Extends<{}, FilterFlattenTypes<Example, boolean>>>()
ta.assert<
  ta.Not<ta.Extends<{ 'd.0': string }, FilterFlattenTypes<Example, boolean>>>
>()
ta.assert<ta.Extends<{ 'd.0': true }, FilterFlattenTypes<Example, boolean>>>()

// Testing things that don't match (TODO, fix this!)
ta.assert<ta.Extends<{}, FilterFlattenTypes<Example, string>>>()
ta.assert<
  ta.Not<ta.Extends<{ z: number }, FilterFlattenTypes<Example, number>>>
>()
ta.assert<
  ta.Not<ta.Extends<{ z: string }, FilterFlattenTypes<Example, string>>>
>()

ta.assert<ta.Extends<{ z: string }, FilterFlattenTypes<Example, boolean>>>()
ta.assert<ta.Extends<{ z: string }, FilterFlattenTypes<Example, ObjectId>>>()
