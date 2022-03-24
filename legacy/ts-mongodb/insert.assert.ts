// https://docs.mongodb.com/manual/reference/operator/query/all/
import { TsCollection } from '.'
import { OptionalUnlessRequiredId } from './type'
import { Fits, NotFit, taAssert } from './type-assertions'

interface Food {
  name: string
  description?: string
  healthy: boolean
}

const connection = null as unknown as TsCollection<Food>
connection.insertOne({ name: 'hi', healthy: true })

const perfectFit = { name: 'hi', healthy: true }
taAssert<Fits<typeof perfectFit, OptionalUnlessRequiredId<Food>>>()

const withOptional = { name: 'hi', description: 'hi', healthy: true }
taAssert<Fits<typeof withOptional, OptionalUnlessRequiredId<Food>>>()

const mismatchedType = { name: 'hi', healthy: 'hi' }
taAssert<NotFit<typeof mismatchedType, OptionalUnlessRequiredId<Food>>>()

const extraArg = { name: 'hi', healthy: true, extra: true }
taAssert<NotFit<typeof extraArg, OptionalUnlessRequiredId<Food>>>()

const missingArg = { name: 'hi' }
taAssert<NotFit<typeof missingArg, OptionalUnlessRequiredId<Food>>>()
