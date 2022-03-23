##

## Philosophy
Mongodb's node-native driver provides poor typescript support.  They need to support every query and update that's allows by the spec, which is difficult to encapsulate in typescript.  The result is promiscuous typesafety that allows even unsafe queries to pass typecheck.

We re-type the node-native driver to provide an uptight type-safety.  We choose to have type-safety disallow queries that are hard to type or which we deem poor practice.  There are plenty of valid mongo queries our type checking disallows but we allow very few bad queries to pass type checking.

### Example
Assume you have a collection type of
```ts
{ admin: { name: string; email: string }[] }
```
The mongo native driver allows queries of the form
```ts
{ `admin.2.name`: 'Joe' }
```
to select the second value in the array `admin`.  In the native driver, this is accomplished via type template-literal typing
```ts
{ [x: `admin.${number}.name`]?: string }
```
Unfortunately, this is overly promiscuous and allows any field, i.e. this query type checks:
```ts
{ 'not-a-field': 'bad query!' }
```
By default, we only allow you to select the 0'th element.  This solves the problem template literal problem.
- As a concession, `Filter` takes an optional second argument (defaults to 0), which can be made `number` for those seeking the original promiscuous behavior.
- In general, we believe it's not typesafe to select arbitrarily into an array so allowing an arbitrary number is probably not great programming practice.

## Roadmap
- Aggregation
- Mapreduce