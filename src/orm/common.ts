export type RecurPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, any> ? RecurPartial<T[P]> : T[P]
}

/**
 * Array extends Document so need a document that does not match an Array
 * However, must also extend Document for `Schema[Property]` to be valid
 */
export type NonArrayObject = {
  [x: string]: any
  [y: number]: never
}
