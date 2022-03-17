import _ from 'underscore'

interface ICoreField {
  name: string
  dbName: string
  required?: boolean
}

interface IFieldType extends ICoreField {
  validate: (input: any) => void
  toDb: (input: any) => any
  fromDb: (input: any) => any
  setName: (name: string) => void
}

class CoreField {
  name: string
  dbName: string
  required?: boolean

  constructor({ name, dbName, required }: ICoreField) {
    this.name = name
    this.dbName = dbName
    this.required = required
  }

  toDb = (input: any) => input
  fromDb = (input: any) => input
  setName = (name: string) => {
    this.name = name
  }
}

export class StringField extends CoreField implements IFieldType {
  __type = 's' as const

  validate = (input: any) => {
    if (!_.isString(input)) {
      throw Error(`Expected string for field ${this.name} but got ${input}`)
    }
  }
}

export class NumberField extends CoreField implements IFieldType {
  __type = 'n' as const

  validate = (input: any) => {
    if (!_.isNumber(input)) {
      throw Error(`Expected number for field ${this.name} but got ${input}`)
    }
  }
}

export type PrimitiveField = StringField | NumberField // | DateField | IdField

export class ArrayField extends CoreField implements IFieldType {
  __type = 'a' as const
  elem: FieldType

  constructor(fields: ICoreField & { elem: FieldType }) {
    super(fields)
    this.elem = fields.elem
  }

  validate = (input: any) => {
    if (!_.isArray(input)) {
      throw Error(`Expected an array for field ${this.name} but got ${input}`)
    }
    input.map((arr) => this.elem.validate(arr))
  }

  toDb = (input: any) => input.map((x: any) => this.elem.toDb(x))
  fromDb = (input: any) => input.map((x: any) => this.elem.fromDb(x))
  setName = (name: string) => {
    this.setName(name)
    this.elem.setName('') // no name for arrays
  }
}

export class ObjectField extends CoreField implements IFieldType {
  __type = 'o' as const
  schema: { [key: string]: FieldType }
  dbSchema: { [key: string]: FieldType }

  constructor(fields: ICoreField & { schema: { [key: string]: FieldType } }) {
    super(fields)
    this.schema = fields.schema
    this.dbSchema = Object.fromEntries(
      Object.entries(fields.schema).map(([key, value]) => [value.dbName, value])
    )
  }

  validate = (input: any) => {
    if (!_.isObject(input)) {
      throw Error(`Expected object for field ${this.name} but got ${input}`)
    }

    const extraInputKeys = _.difference(
      Object.keys(input),
      Object.keys(this.schema)
    )
    if (extraInputKeys.length > 0) {
      throw Error(
        `Found extra input keys in object ${this.name}: ${extraInputKeys}`
      )
    }

    const missingRequiredKeys = _.difference(
      Object.entries(this.schema)
        .filter(([_, value]) => value.required)
        .map(([key, _]) => key),
      Object.keys(input)
    )
    if (missingRequiredKeys.length > 0) {
      throw Error(
        `Object at ${this.name} missing values for ${missingRequiredKeys}`
      )
    }

    Object.entries(input).forEach(([key, value]) =>
      this.schema[key].validate(value)
    )
  }

  toDb = (input: Record<string, any>): Record<string, any> => {
    const entries = Object.entries(input).map(
      ([key, value]) =>
        [this.schema[key].dbName, this.schema[key].toDb(value)] as const
    )
    return Object.fromEntries(entries)
  }

  fromDb = (input: Record<string, any>): Record<string, any> => {
    const entries = Object.entries(input).map(
      ([key, value]) =>
        [this.dbSchema[key].name, this.dbSchema[key].fromDb(value)] as const
    )
    return Object.fromEntries(entries)
  }

  setName = (name: string) => {
    this.setName(name)
    Object.entries(this.schema).forEach(([key, field]) => {
      field.setName(key)
    })
  }
}

type FieldType = PrimitiveField | ObjectField

type IPrimitiveFieldProps = Omit<ICoreField, 'name'>
export const stringField = (fields: IPrimitiveFieldProps) =>
  new StringField({ ...fields, name: '' })

export const numberField = (fields: IPrimitiveFieldProps) =>
  new NumberField({ ...fields, name: '' })

export const arrayField = (
  fields: IPrimitiveFieldProps & { elem: FieldType }
) => new ArrayField({ ...fields, name: '' })

export const objectField = (
  fields: IPrimitiveFieldProps & { schema: { [key: string]: FieldType } }
) => new ObjectField({ ...fields, name: '' })

export const createSchema = (schema: { [key: string]: FieldType }) => {
  Object.entries(schema).forEach(([key, field]) => {
    field.setName(key)
  })
  return new ObjectField({ name: '[root]', dbName: '', schema })
}
