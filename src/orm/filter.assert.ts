import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { Filter, FilterType, NonArrayObject, WithOperator } from './filter'

// Test NonArrayObject
ta.assert<ta.Extends<{ a: 2; b: string }, NonArrayObject>>()
ta.assert<ta.Not<ta.Extends<{ a: 2; b: string }[], NonArrayObject>>>()

// Test WithOperator number
ta.assert<ta.Extends<{ $eq: 2 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $nin: [2, 3] }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $eq: 'A' }, WithOperator<number>>>>()
ta.assert<ta.Extends<{ $lt: 2 }, WithOperator<number>>>()

// Test WithOperator string
ta.assert<ta.Extends<{ $eq: 'a' }, WithOperator<string>>>()
const regex = { $regex: /hi/ }
ta.assert<ta.Extends<typeof regex, WithOperator<string>>>()
ta.assert<ta.Not<ta.Extends<{ $lt: 'a' }, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<{ $lt: 2 }, WithOperator<string>>>>()

// Test WithOperator number
ta.assert<ta.Extends<2, WithOperator<number>>>()
ta.assert<ta.Extends<{ $eq: 2 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $gte: 2 }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $eq: 'a' }, WithOperator<number>>>>()
ta.assert<ta.Extends<{ $exists: true }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $exists: 2 }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $text: 'hi' }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $size: 1 }, WithOperator<number>>>>()

// Test WithOperator string
ta.assert<ta.Extends<'a', WithOperator<string>>>()
ta.assert<ta.Extends<{ $eq: 'a' }, WithOperator<string>>>()
ta.assert<ta.Not<ta.Extends<{ $gt: 'a' }, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<{ $gt: 2 }, WithOperator<string>>>>()

// Test WithOperator array
ta.assert<ta.Extends<{ $size: 2 }, WithOperator<string[]>>>()
ta.assert<ta.Not<ta.Extends<{ $size: 'a' }, WithOperator<string[]>>>>()
ta.assert<ta.Extends<{ $all: ['a', 'b'] }, WithOperator<string[]>>>()
ta.assert<ta.Not<ta.Extends<{ $all: [2] }, WithOperator<string[]>>>>()
ta.assert<ta.Not<ta.Extends<{ $all: 'a' }, WithOperator<string[]>>>>()
ta.assert<ta.Extends<{ $size: 2 }, WithOperator<{ a: number }[]>>>()
ta.assert<ta.Extends<{ $all: [{ a: 2 }] }, WithOperator<{ a: number }[]>>>()
ta.assert<
  ta.Extends<
    { $all: [{ $elemMatch: { a: { $gte: 4 } } }] },
    WithOperator<{ a: number }[]>
  >
>()

// Test WithOperator equivalence
// https://docs.mongodb.com/manual/reference/operator/query/all/
ta.assert<
  ta.Extends<{ $all: [{ a: 2 }, { a: 2 }] }, WithOperator<{ a: number[] }>>
>()
ta.assert<ta.Extends<{ a: { $all: [2, 3] } }, WithOperator<{ a: number[] }>>>()
ta.assert<
  ta.Extends<{ $and: [{ a: [2, 3] }] }, WithOperator<{ a: number[] }>>
>()
ta.assert<ta.Extends<{ a: [2, 3] }, WithOperator<{ a: number[] }>>>()

// Test WithOperator negation
ta.assert<ta.Extends<{ $not: { $gt: 2 } }, WithOperator<number>>>()

// Test WithOperator -- directly accessing value
ta.assert<ta.Extends<4, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<'a', WithOperator<number>>>>()
ta.assert<ta.Extends<'a', WithOperator<string>>>()

// Test with $and
ta.assert<ta.Extends<{ a: { $gt: 2 } }, Filter<{ a: number }>>>()
ta.assert<
  ta.Extends<
    { $and: [{ a: { $gt: 2 } }, { a: { $le: 5 } }] },
    Filter<{ a: number }>
  >
>()

// Test $not operator
ta.assert<ta.Extends<{ a: { $not: { $gt: 2 } } }, Filter<{ a: number }>>>()
ta.assert<
  ta.Extends<
    { a: { $not: { $text: { $search: 'a' } } } },
    Filter<{ a: string }>
  >
>()

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

// Test FilterType - direct
ta.assert<ta.Extends<number, FilterType<Example, 'a'>>>()
ta.assert<ta.Extends<string, FilterType<Example, 'b.c'>>>()
ta.assert<ta.Extends<boolean, FilterType<Example, 'b.d.e'>>>()
ta.assert<ta.Extends<{ e: boolean }, FilterType<Example, 'b.d'>>>()
ta.assert<
  ta.Extends<
    {
      c: string
      d: {
        e: boolean
      }
    },
    FilterType<Example, 'b'>
  >
>()
ta.assert<ta.Extends<ObjectId[], FilterType<Example, 'a.b.f'>>>()

// Test FilterType - with operators
ta.assert<ta.Extends<{ $lt: 2 }, FilterType<Example, 'a'>>>()
ta.assert<
  ta.Extends<{ $text: { $search: 'hi' } }, FilterType<Example, 'b.c'>>
>()
ta.assert<ta.Extends<{ $exists: true }, FilterType<Example, 'b.d'>>>()
ta.assert<ta.Extends<{ e: { $eq: false } }, FilterType<Example, 'b.d'>>>()
ta.assert<ta.Extends<{ $size: 2 }, FilterType<Example, 'a.b.f'>>>()

// These use to be wrong, keeping as regression testing
ta.assert<ta.Not<ta.Extends<{ a: 2 }, WithOperator<{ a: number }[]>>>>()
