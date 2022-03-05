# mongo-proto

## ts-mongodb
Opinionated types for `mongodb`'s native collections object.

The original `collection` has very loose typing.  The philosophy of this package is to restrict the available inputs to an otherwise identical `collection` to obtain a more type-safe class.  While this does not allow all the original operations, it should still allow everything to be done -- just in a different manner.  The restrictions were chose because they are more easy to make type-safe.  These extensions include
- Each `cursor`'s `project` method takes a typesafe `Projection` that returns a cursor with narrowed type.  Furthermore, the `projection` arguments are disabled because they are redundant (can always chain `project`) and cannot (as) easily support a narrow-typed return cursor.  **TODO**: consider narrowing `ProjectionOperators`.
- The `Filter` parameters only allow full dot-path notation (to the terminating types) or the first level fields, not arbitrary strings.
- The `Sort` parameters are similarly constrained

There is an escape hatch to use the original broadly-typed object via the pejoratively-named `unsafe` property.


## Results
- timePost can do 50-60 qps before performance starts deteriorating
- timePostAggProject (doesn't return the text fields) is also between 50-60 qps -- removing a large amount of data does not seem to improve throughput
- timePostAgg can do between 90-100 qps

## Results 2
- timePost can do 100 qps if it's only a single query.

## Result 3
- With no congestion, a small query has an overhead of 25ms.
- 1MB takes approximately 250ms to transfer.

## Result 4
With a joined collection we have several ways to connect them.  Assume we have a user who has multiple posts:
1. Embed the post directly in the user.  Queries for user and their posts return in 33ms (assuming a small amount of data)
2. A list of post object ids in the user object.  Queries are necessarily sequential (first query user, then the corresponding object) and take 56ms in total.
3. The user id on the post object.  Even with an index on the user id on post and parralelizing the user and post query, the results take 54ms in total.  However, the standard deviation of times is lower.
4. Use the `$lookup` and `aggregate` to query the data layout in #3 as a single query.  This is now back to 29ms.

╔════════════╤═══════════════════╤═══════════════════╤═══════════════════╤═══════════════════╤═══════════════════╗
║            │ name              │ timeMs_mean       │ timeMs_std        │ length_mean       │ length_count      ║
╟────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
║ 0          │ timeA             │ 32.75             │ 5.4374432846406…  │ 5.1009489985609…  │ 20                ║
╟────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
║ 1          │ timeB             │ 56.4              │ 4.9032749528409…  │ 6.3081080781011…  │ 20                ║
╟────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
║ 2          │ timeC             │ 54.55             │ 2.0894471693929…  │ 5.5508060575758…  │ 20                ║
╟────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
║ 3          │ timeC2            │ 29.45             │ 2.8923674513595…  │ 5.2955085762355…  │ 20                ║
╚════════════╧═══════════════════╧═══════════════════╧═══════════════════╧═══════════════════╧═══════════════════╝

The results indicate suggests that #3 is being run sequentially on the server because mongo is single-threading the queries.  [This post](https://www.mongodb.com/community/forums/t/will-mongodb-utilize-all-my-4-cpus/3721/4?u=tianhui_li) confirms that mongo will single-thread the requests from a given connection.
