import {
  ArrayField,
  arrayField,
  createSchema,
  numberField,
  ObjectField,
  objectField,
  StringField,
  stringField,
} from './schema'

describe('ORM Test', () => {
  test('name is set on schema', () => {
    const schema = createSchema({
      str: stringField({ dbName: 's' }),
      num: stringField({ dbName: 'n', required: true }),
    })

    expect(schema.schema.str.dbName).toBe('s')
    expect(schema.schema.str.name).toBe('str')
    expect(schema.schema.num.dbName).toBe('n')
    expect(schema.schema.num.name).toBe('num')
  })

  test('name is set on array', () => {
    const schema = createSchema({
      arr: arrayField({ dbName: 'a', elem: stringField({ dbName: '' }) }),
    })

    expect(schema.schema.arr.dbName).toBe('a')
    expect(schema.schema.arr.name).toBe('arr')
    expect((schema.schema.arr as ArrayField).elem).toBeInstanceOf(StringField)
  })

  test('name is set on object', () => {
    const schema = createSchema({
      obj: objectField({
        dbName: 'o',
        schema: {
          str: stringField({ dbName: 's' }),
        },
      }),
    })

    expect(schema.schema.obj.dbName).toBe('o')
    expect(schema.schema.obj.name).toBe('obj')
    expect((schema.schema.obj as ObjectField).schema.str.dbName).toBe('s')
    expect((schema.schema.obj as ObjectField).schema.str.name).toBe('str')
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
