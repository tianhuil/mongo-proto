# mongo-proto

## ts-mongodb
The original `collection` has very loose typing.  The philosophy of this package is to restrict the available inputs to an otherwise identical `collection` obtain a more type-safe class.  While this does not allow all the original operations, it should still allow everything to be done -- just in a different manner.  The restrictions were chose because they are more easy to make type-safe.  These extensions include
- Each `cursor`'s `project` method takes a typesafe `Projection` that returns a cursor with narrowed type.  Furthermore, the `projection` arguments are disabled because they are redundant (can always chain `project`) and cannot (as) easily support a narrow-typed return cursor.  **TODO**: consider narrowing `ProjectionOperators`.
- The `Filter` parameters only allow full dot-path notation (to the terminating types) or the first level fields, not arbitrary strings.
- The `Sort` parameters are similarly constrained

There is an escape hatch to use the original broadly-typed object via the pejoratively-named `unsafe` property.


## Results
- timePost can do 50-60 qps before performance starts deteriorating
- timePostAggProject (doesn't return the text fields) is also between 50-60 qps -- removing a large amount of data does not seem to improve throughput
- timePostAgg can do between 90-100 qps
