import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { DotPaths } from './dot'

interface Example {
  a: number
  b: {
    c: string
    d: {
      e: boolean
    }
    f: ObjectId[]
  }
}

ta.assert<
  ta.Equal<
    '_id' | 'a' | 'b' | 'b.c' | 'b.d.e' | 'b.d' | 'b.f' | `b.f.${number}`,
    DotPaths<Example>
  >
>()
