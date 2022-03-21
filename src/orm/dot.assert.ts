import * as ta from 'type-assertions'
import { DotPaths } from './dot'

interface Example {
  a: number
  b: {
    c: string
    d: {
      e: boolean
    }
  }
}

ta.assert<
  ta.Equal<'_id' | 'a' | 'b' | 'b.c' | 'b.d.e' | 'b.d', DotPaths<Example>>
>()
