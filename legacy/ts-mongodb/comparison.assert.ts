// https://docs.mongodb.com/manual/reference/operator/query/all/
import * as ta from 'type-assertions'
import { Equal } from 'type-assertions'
import { Filter } from './type'

interface Inventory {
  item: { name: string; code: string }
  qty: number
  tags: string[]
}

type EqualFilter<Actual, Type> = Equal<Actual, Filter<Type>>

ta.assert<ExtendsFilter<{ qty: { $eq: 20 } }, Inventory>>()
ta.assert<EqualFilter<{ qty: 20 }, Inventory>>()
ta.assert<ta.Not<EqualFilter<{ qty: 'ab' }, Inventory>>>()
ta.assert<ta.Not<EqualFilter<{ abc: 'ab' }, Inventory>>>()
