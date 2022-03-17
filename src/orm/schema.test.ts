import { createSchema, numberField, stringField } from './schema'

describe('ORM Test', () => {
  test('name is set', () => {
    const schema = createSchema({
      str: stringField({ dbName: 's' }),
      num: stringField({ dbName: 'n', required: true }),
    })

    expect(schema.schema.str.dbName).toBe('s')
    expect(schema.schema.str.name).toBe('str')
    expect(schema.schema.num.dbName).toBe('n')
    expect(schema.schema.num.name).toBe('num')
  })

  test('required', () => {
    const schema = createSchema({
      str: stringField({ dbName: 's' }),
      num: stringField({ dbName: 'n', required: true }),
    })

    expect(() => schema.validate({})).toThrowError('missing')
    expect(() => schema.validate({ str: 'hi' })).toThrowError('missing')
  })

  test('str type', () => {
    const schema = createSchema({
      str: stringField({ dbName: 's' }),
    })

    expect(() => schema.validate({ str: 1 })).toThrowError('')
    expect(schema.validate({ str: 'a' })).toBeUndefined()
  })

  test('num type', () => {
    const schema = createSchema({
      num: numberField({ dbName: 'n' }),
    })

    expect(() => schema.validate({ num: 'a' })).toThrowError('')
    expect(schema.validate({ num: 1 })).toBeUndefined()
  })
})
