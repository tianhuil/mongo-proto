import * as ta from 'type-assertions'
import { NonArrayObject } from './common'

// Test NonArrayObject
ta.assert<ta.Extends<{ a: 2; b: string }, NonArrayObject>>()
ta.assert<ta.Not<ta.Extends<{ a: 2; b: string }[], NonArrayObject>>>()

interface IObj {
  a: 2
  b: string
}

type TObj = {
  a: 2
  b: string
}

const obj = {
  a: 2,
  b: 'hi',
}
type TObj2 = typeof obj

// Note: cannot use interface, must use type = { ... }
ta.assert<ta.Not<ta.Extends<IObj, NonArrayObject>>>()
ta.assert<ta.Not<ta.Extends<IObj, Record<string, unknown>>>>()

ta.assert<ta.Extends<TObj, NonArrayObject>>()
ta.assert<ta.Extends<TObj, Record<string, unknown>>>()

ta.assert<ta.Extends<TObj2, NonArrayObject>>()
ta.assert<ta.Extends<TObj2, Record<string, unknown>>>()

ta.assert<ta.Extends<string, string | number>>()
ta.assert<ta.Extends<string, unknown>>()
