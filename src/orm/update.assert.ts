import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { SelectFlattenUpdatePaths, UpdateFlattenTypes } from './update'

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
ta.assert<ta.Equal<'a', SelectFlattenUpdatePaths<Example, string>>>()
ta.assert<ta.Not<ta.Equal<'z', SelectFlattenUpdatePaths<Example, string>>>>()
ta.assert<ta.Not<ta.Equal<'a', SelectFlattenUpdatePaths<Example, number>>>>()
ta.assert<ta.Equal<'b.c' | 'g', SelectFlattenUpdatePaths<Example, number>>>()
ta.assert<ta.Equal<'b', SelectFlattenUpdatePaths<Example, { c: number }>>>()
ta.assert<
  ta.Equal<'d.$' | 'd.$[]', SelectFlattenUpdatePaths<Example, boolean>>
>()
ta.assert<
  ta.Not<ta.Extends<'d.x', SelectFlattenUpdatePaths<Example, boolean>>>
>()
ta.assert<ta.Not<ta.Equal<`d`, SelectFlattenUpdatePaths<Example, boolean>>>>()
ta.assert<ta.Not<ta.Equal<`d`, SelectFlattenUpdatePaths<Example, boolean>>>>()
ta.assert<
  ta.Equal<
    '_id' | 'e.f' | 'e.$.f' | 'e.$[].f',
    SelectFlattenUpdatePaths<Example, ObjectId>
  >
>()

// Test FilterFlattenTypes
ta.assert<ta.Equal<{ a?: string }, UpdateFlattenTypes<Example, string>>>()
ta.assert<ta.Extends<{ 'b.c': number }, UpdateFlattenTypes<Example, number>>>()
ta.assert<
  ta.Equal<{ 'b.c'?: number; g?: number }, UpdateFlattenTypes<Example, number>>
>()
ta.assert<
  ta.Equal<
    { [x in `d.${number}`]: boolean | undefined },
    UpdateFlattenTypes<Example, boolean>
  >
>()
ta.assert<ta.Extends<{}, UpdateFlattenTypes<Example, boolean>>>()
ta.assert<
  ta.Not<ta.Extends<{ 'd.$': string }, UpdateFlattenTypes<Example, boolean>>>
>()
ta.assert<ta.Extends<{ 'd.$': true }, UpdateFlattenTypes<Example, boolean>>>()

type X = UpdateFlattenTypes<Example, boolean>

// Testing things that don't match (TODO, fix this!)
ta.assert<ta.Extends<{}, UpdateFlattenTypes<Example, string>>>()
ta.assert<
  ta.Not<ta.Extends<{ z: number }, UpdateFlattenTypes<Example, number>>>
>()
ta.assert<
  ta.Not<ta.Extends<{ z: string }, UpdateFlattenTypes<Example, string>>>
>()

ta.assert<
  ta.Not<ta.Extends<{ z: string }, UpdateFlattenTypes<Example, boolean>>>
>()
ta.assert<
  ta.Not<ta.Extends<{ z: string }, UpdateFlattenTypes<Example, ObjectId>>>
>()
