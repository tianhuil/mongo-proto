import * as ta from 'type-assertions'
import { Extends } from 'type-assertions'

export type NotEqual<A, B> = ta.Not<ta.Equal<A, B>>
export type NotExtend<A, B> = ta.Not<ta.Extends<A, B>>
export type Fits<
  Actual extends Record<string, any>,
  Expected extends Record<string, any>
> = ta.And<Extends<keyof Actual, keyof Expected>, Extends<Actual, Expected>>
export type NotFit<
  Actual extends Record<string, any>,
  Expected extends Record<string, any>
> = ta.Not<Fits<Actual, Expected>>
export * from 'type-assertions'
export { assert as taAssert } from 'type-assertions'

ta.assert<NotEqual<{ x: 1 }, never>>()
ta.assert<Extends<'a', string>>()
ta.assert<NotExtend<string, 'a'>>()

interface Foo {
  foo: number
  bar: string
}

ta.assert<Extends<{ foo: 1; bar: 'a' }, Foo>>()
ta.assert<NotExtend<{ foo: 1; bar: 2 }, Foo>>()
ta.assert<NotExtend<Foo, { foo: 1; bar: 'a' }>>()
