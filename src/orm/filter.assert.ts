import { Document } from 'mongodb'
import * as ta from 'type-assertions'
import {
  Filter,
  PropertyType,
  WithComparisonOperator,
  WithNumericOperator,
  WithOperator,
} from './filter'

// Test WithComparisonOperator number
ta.assert<ta.Extends<{ $eq: 2 }, WithComparisonOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $eq: 'A' }, WithComparisonOperator<number>>>>()
ta.assert<ta.Extends<{ $lt: 2 }, WithNumericOperator<number>>>()

// Test WithComparisonOperator string
ta.assert<ta.Extends<{ $eq: 'a' }, WithComparisonOperator<string>>>()
ta.assert<ta.Not<ta.Extends<{ $lt: 'a' }, WithComparisonOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<{ $lt: 2 }, WithComparisonOperator<string>>>>()

// Test WithOperator number
ta.assert<ta.Extends<{ $eq: 2 }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $eq: 'a' }, WithOperator<number>>>>()
ta.assert<ta.Extends<{ $exists: true }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $exists: 2 }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $text: 'hi' }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $size: 1 }, WithOperator<number>>>>()

// Test WithOperator string
ta.assert<ta.Extends<{ $eq: 'a' }, WithOperator<string>>>()
ta.assert<ta.Not<ta.Extends<{ $gt: 'a' }, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<{ $gt: 2 }, WithOperator<string>>>>()

// Test WithOperator array
ta.assert<ta.Extends<{ $size: 2 }, WithOperator<string[]>>>()
ta.assert<ta.Not<ta.Extends<{ $size: 'a' }, WithOperator<string[]>>>>()
ta.assert<ta.Extends<{ $all: ['a', 'b'] }, WithOperator<string[]>>>()
ta.assert<ta.Not<ta.Extends<{ $all: [2] }, WithOperator<string[]>>>>()
ta.assert<ta.Not<ta.Extends<{ $all: 'a' }, WithOperator<string[]>>>>()

ta.assert<ta.Extends<{ $eq: 2 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $eq: 2 }, WithOperator<number>>>()

// Test WithOperator negation
ta.assert<ta.Extends<{ $not: { $gt: 2 } }, WithOperator<number>>>()

// Test WithOperator -- directly accessing value
ta.assert<ta.Extends<4, WithOperator<number>>>()

// Test with $and
ta.assert<ta.Extends<{ a: { $gt: 2 } }, Filter<{ a: number }>>>()
ta.assert<
  ta.Extends<
    { $and: [{ a: { $gt: 2 } }, { a: { $le: 5 } }] },
    Filter<{ a: number }>
  >
>()

//
interface Example {
  a: number
  b: {
    c: string
    d: {
      e: boolean
    }
  }
}

ta.assert<ta.Equal<PropertyType<Example, 'a'>, number>>()
ta.assert<ta.Equal<PropertyType<Example, 'b.c'>, string>>()
ta.assert<ta.Equal<PropertyType<Example, 'b.d.e'>, boolean>>()
ta.assert<ta.Equal<PropertyType<Example, 'b.d'>, { e: boolean }>>()
ta.assert<
  ta.Equal<
    PropertyType<Example, 'b'>,
    {
      c: string
      d: {
        e: boolean
      }
    }
  >
>()

type X = PropertyType<Example, 'a'>

type Z = Example extends Document ? true : false
