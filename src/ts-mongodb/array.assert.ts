// https://docs.mongodb.com/manual/reference/operator/query/all/
import * as ta from 'type-assertions'
import { Extends } from 'type-assertions'
import { Filter } from './type'

type ExtendsFilter<Actual, Type> = Extends<Actual, Filter<Type>>

interface Inventory {
  code: string
  tags: string[]
  qty: { size: string; num: number; color: string }[]
}

ta.assert<
  ExtendsFilter<
    {
      qty: {
        $all: [
          { $elemMatch: { size: 'M'; num: { $gt: 50 } } },
          { $elemMatch: { num: 100; color: 'green' } }
        ]
      }
    },
    Inventory
  >
>()

ta.assert<ExtendsFilter<{ 'qty.num': { $all: [50] } }, Inventory>>()

ta.assert<ExtendsFilter<{ 'qty.num': 50 }, Inventory>>()

//docs.mongodb.com/manual/reference/operator/query/elemMatch/
interface Score {
  results: number[]
}
ta.assert<
  ExtendsFilter<{ results: { $elemMatch: { $gte: 80; $lt: 85 } } }, Score>
>()

interface Survey {
  results: { product: string; score: number }[]
}
ta.assert<
  ExtendsFilter<
    { results: { $elemMatch: { product: 'xyz'; score: 8 } } },
    Survey
  >
>()

ta.assert<
  ExtendsFilter<
    { results: { $elemMatch: { product: 'xyz'; score: { $gte: 8 } } } },
    Survey
  >
>()
