import * as ta from 'type-assertions'
import _ from 'underscore'


interface StringField {
  __type: 's'
}

type FieldKey = `${string}/${string}${'?' | '!'}`
type FieldKeyName <T extends FieldKey> = T extends `${infer Name}/${string}${'?' | '!'}` ? Name : never
type FieldKeyDbName <T extends FieldKey> = T extends `${string}/${infer DbName}${'?' | '!'}` ? DbName : never
type FieldKeyRequired <T extends FieldKey> = T extends `${string}/${string}${infer Required}` ? Required extends '?' ? false : true : never

ta.assert<ta.Extends<'name/n!', FieldKey>>()
ta.assert<ta.Extends<'name/n?', FieldKey>>()
ta.assert<ta.Extends<FieldKey, string>>()
ta.assert<ta.Not<ta.Extends<'name/n', FieldKey>>>()
ta.assert<ta.Not<ta.Extends<'foo', FieldKey>>>()

ta.assert<ta.Equal<FieldKeyName<'name/n?'>, 'name'>>()
ta.assert<ta.Equal<FieldKeyDbName<'name/n?'>, 'n'>>()
ta.assert<ta.Equal<FieldKeyRequired<'name/n!'>, true>>()
ta.assert<ta.Equal<FieldKeyRequired<'name/n?'>, false>>()


type Schema = Record<FieldKey, Field>
type Enrich<S extends Schema> = {
  [K in keyof S & FieldKey]: RichField<K, S[K]>
}

type ByName<EnrichedSchema extends Record<FieldKey, RichField>> = {
  [K in keyof EnrichedSchema]: EnrichedSchema[K]
}

type SchemaByName<Schema extends Record<FieldKey, Field>> = {
  [key in FieldKeyName<keyof Enrich<Schema> & FieldKey>]: Schema[key]
}

type SchemaByDbName<Schema extends Record<FieldKey, Field>> = {
  [key: FieldKeyDbName<keyof Enrich<Schema> & FieldKey>]: RichField
}

interface RichField<Key extends FieldKey = FieldKey, F extends Field = Field> {
  name: FieldKeyName<Key>
  dbName: FieldKeyDbName<Key>
  required: FieldKeyRequired<Key>
  data: F
}

const input = {
  a: {long: 'aa', short: 'a'},
  b: {long: 'bb', short: 'b'},
} as const

const output ={
  aa: {long: 'aa', short: 'a'},
  bb: {long: 'bb', short: 'b'},
} as const

type Output = typeof output

type K = keyof typeof input
type V = (typeof input)[K]

const x = Object.entries(input).map(([k, v]) => [v.long, v] as const)
const y = Object.fromEntries(x)

// interface RichField {
//   name: string
//   dbName: string
//   required: boolean
//   data: Field
// }

abstract class BaseField<T> {
  abstract validate: (input: T) => void
  toDb = (input: T): T => input
  fromDb = (input: T): T => input
}

class StringField extends BaseField<string> {
  __type = 's' as const
  validate = (input: string) => {
    if (!_.isString(input)) {
      throw Error(`Expected string but got ${input}`)
    }
  }
}



class ObjectField extends BaseField<Schema> {
  __type = 'o' as const
  __schemaByName: SchemaByName<Schema>
  __schemaByDbName: SchemaByDbName<Schema>

  constructor(public schema: Schema) {
    super()
    const richSchemas =

    this.__schemaByName =
  }

  extractValidateRichSchemas = (schema: Schema): RichSchema[] => {
    Object.entries(schema).map(([key, value]) => {
      A
    })
  }

  validate = (input: any) => {
    if (!_.isObject(input)) {
      throw Error(`Expected object but got ${input}`)
    }

    const extraInputKeys = _.difference(
      Object.keys(input),
      Object.keys(this.schema)
    )
    if (extraInputKeys.length > 0) {
      throw Error(`Found extra input key: ${extraInputKeys}`)
    }

    const missingRequiredKeys = _.difference(
      Object.entries(this.schema)
        .filter(([_, value]) => value.required)
        .map(([key, _]) => key),
      Object.keys(input)
    )
    if (missingRequiredKeys.length > 0) {
      throw Error(`Object is missing missing values for ${missingRequiredKeys}`)
    }

    Object.entries(input).forEach(([key, value]) =>
      this.schema[key].validate(value)
    )
  }
}

interface ArrayField {
  __type: 'a'
  elem: Field
}

type Field = StringField | ObjectField | ArrayField


// const stringField = (): StringField => ({ __type: 's' } as const)

// const objectField = (schema: Schema): ObjectField =>
//   ({
//     __type: 'o',
//     schema,
//   } as const)
