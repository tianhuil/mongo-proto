import {
  BulkWriteOptions,
  Callback,
  CountDocumentsOptions,
  DeleteOptions,
  DeleteResult,
  DistinctOptions,
  Document,
  Flatten,
  InsertManyResult,
  InsertOneOptions,
  InsertOneResult,
  ModifyResult,
  OperationOptions,
  OptionalUnlessRequiredId,
  ReplaceOptions,
  UpdateOptions,
  UpdateResult,
  WithId,
  WithoutId,
} from 'mongodb'
import { Filter } from './filter'
import {
  TsFindCursor,
  TsFindOneAndDeleteOptions,
  TsFindOneAndReplaceOptions,
  TsFindOneAndUpdateOptions,
  TsFindOptions,
} from './find'
import { Update } from './update'

export declare class SafeCollection<TSchema extends Document> {
  /**
   * Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @param doc - The document to insert
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  insertOne(
    doc: OptionalUnlessRequiredId<TSchema>
  ): Promise<InsertOneResult<TSchema>>
  insertOne(
    doc: OptionalUnlessRequiredId<TSchema>,
    callback: Callback<InsertOneResult<TSchema>>
  ): void
  insertOne(
    doc: OptionalUnlessRequiredId<TSchema>,
    options: InsertOneOptions
  ): Promise<InsertOneResult<TSchema>>
  insertOne(
    doc: OptionalUnlessRequiredId<TSchema>,
    options: InsertOneOptions,
    callback: Callback<InsertOneResult<TSchema>>
  ): void
  /**
   * Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @param docs - The documents to insert
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  insertMany(
    docs: OptionalUnlessRequiredId<TSchema>[]
  ): Promise<InsertManyResult<TSchema>>
  insertMany(
    docs: OptionalUnlessRequiredId<TSchema>[],
    callback: Callback<InsertManyResult<TSchema>>
  ): void
  insertMany(
    docs: OptionalUnlessRequiredId<TSchema>[],
    options: BulkWriteOptions
  ): Promise<InsertManyResult<TSchema>>
  insertMany(
    docs: OptionalUnlessRequiredId<TSchema>[],
    options: BulkWriteOptions,
    callback: Callback<InsertManyResult<TSchema>>
  ): void
  /**
   * Update a single document in a collection
   *
   * @param filter - The filter used to select the document to update
   * @param update - The update operations to be applied to the document
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  updateOne(
    filter: Filter<TSchema>,
    update: Update<TSchema>
  ): Promise<UpdateResult>
  updateOne(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    callback: Callback<UpdateResult>
  ): void
  updateOne(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    options: UpdateOptions
  ): Promise<UpdateResult>
  updateOne(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    options: UpdateOptions,
    callback: Callback<UpdateResult>
  ): void
  /**
   * Replace a document in a collection with another document
   *
   * @param filter - The filter used to select the document to replace
   * @param replacement - The Document that replaces the matching document
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  replaceOne(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>
  ): Promise<UpdateResult | Document>
  replaceOne(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>,
    callback: Callback<UpdateResult | Document>
  ): void
  replaceOne(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>,
    options: ReplaceOptions
  ): Promise<UpdateResult | Document>
  replaceOne(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>,
    options: ReplaceOptions,
    callback: Callback<UpdateResult | Document>
  ): void
  /**
   * Update multiple documents in a collection
   *
   * @param filter - The filter used to select the documents to update
   * @param update - The update operations to be applied to the documents
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  updateMany(
    filter: Filter<TSchema>,
    update: Update<TSchema>
  ): Promise<UpdateResult | Document>
  updateMany(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    callback: Callback<UpdateResult | Document>
  ): void
  updateMany(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    options: UpdateOptions
  ): Promise<UpdateResult | Document>
  updateMany(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    options: UpdateOptions,
    callback: Callback<UpdateResult | Document>
  ): void
  /**
   * Delete a document from a collection
   *
   * @param filter - The filter used to select the document to remove
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  deleteOne(filter: Filter<TSchema>): Promise<DeleteResult>
  deleteOne(filter: Filter<TSchema>, callback: Callback<DeleteResult>): void
  deleteOne(
    filter: Filter<TSchema>,
    options: DeleteOptions
  ): Promise<DeleteResult>
  deleteOne(
    filter: Filter<TSchema>,
    options: DeleteOptions,
    callback?: Callback<DeleteResult>
  ): void
  /**
   * Delete multiple documents from a collection
   *
   * @param filter - The filter used to select the documents to remove
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  deleteMany(filter: Filter<TSchema>): Promise<DeleteResult>
  deleteMany(filter: Filter<TSchema>, callback: Callback<DeleteResult>): void
  deleteMany(
    filter: Filter<TSchema>,
    options: DeleteOptions
  ): Promise<DeleteResult>
  deleteMany(
    filter: Filter<TSchema>,
    options: DeleteOptions,
    callback: Callback<DeleteResult>
  ): void
  /**
   * Fetches the first document that matches the filter
   *
   * @param filter - Query for find Operation
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  findOne(): Promise<WithId<TSchema> | null>
  findOne(callback: Callback<WithId<TSchema> | null>): void
  findOne(filter: Filter<TSchema>): Promise<WithId<TSchema> | null>
  findOne(
    filter: Filter<TSchema>,
    callback: Callback<WithId<TSchema> | null>
  ): void
  findOne(
    filter: Filter<TSchema>,
    options: TsFindOptions<TSchema>
  ): Promise<WithId<TSchema> | null>
  findOne(
    filter: Filter<TSchema>,
    options: TsFindOptions<TSchema>,
    callback: Callback<WithId<TSchema> | null>
  ): void
  findOne<T = TSchema>(): Promise<T | null>
  findOne<T = TSchema>(callback: Callback<T | null>): void
  findOne<T = TSchema>(filter: Filter<TSchema>): Promise<T | null>
  findOne<T = TSchema>(
    filter: Filter<TSchema>,
    options?: TsFindOptions<TSchema>
  ): Promise<T | null>
  findOne<T = TSchema>(
    filter: Filter<TSchema>,
    options?: TsFindOptions<TSchema>,
    callback?: Callback<T | null>
  ): void
  /**
   * Creates a cursor for a filter that can be used to iterate over results from MongoDB
   *
   * @param filter - The filter predicate. If unspecified, then all documents in the collection will match the predicate
   */
  find(): TsFindCursor<WithId<TSchema>>
  find(
    filter: Filter<TSchema>,
    options?: TsFindOptions<TSchema>
  ): TsFindCursor<WithId<TSchema>>
  find<T>(
    filter: Filter<TSchema>,
    options?: TsFindOptions<TSchema>
  ): TsFindCursor<T>
  /**
   * Returns the options of the collection.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  options(): Promise<Document>
  options(callback: Callback<Document>): void
  options(options: OperationOptions): Promise<Document>
  options(options: OperationOptions, callback: Callback<Document>): void
  // /**
  //  * Creates an index on the db and collection collection.
  //  *
  //  * @param indexSpec - The field name or index specification to create an index for
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  *
  //  * @example
  //  * ```js
  //  * const collection = client.db('foo').collection('bar');
  //  *
  //  * await collection.createIndex({ a: 1, b: -1 });
  //  *
  //  * // Alternate syntax for { c: 1, d: -1 } that ensures order of indexes
  //  * await collection.createIndex([ [c, 1], [d, -1] ]);
  //  *
  //  * // Equivalent to { e: 1 }
  //  * await collection.createIndex('e');
  //  *
  //  * // Equivalent to { f: 1, g: 1 }
  //  * await collection.createIndex(['f', 'g'])
  //  *
  //  * // Equivalent to { h: 1, i: -1 }
  //  * await collection.createIndex([ { h: 1 }, { i: -1 } ]);
  //  *
  //  * // Equivalent to { j: 1, k: -1, l: 2d }
  //  * await collection.createIndex(['j', ['k', -1], { l: '2d' }])
  //  * ```
  //  */
  // createIndex(indexSpec: IndexSpecification<TSchema>): Promise<string>
  // createIndex(
  //   indexSpec: IndexSpecification<TSchema>,
  //   callback: Callback<string>
  // ): void
  // createIndex(
  //   indexSpec: IndexSpecification<TSchema>,
  //   options: CreateIndexesOptions
  // ): Promise<string>
  // createIndex(
  //   indexSpec: IndexSpecification<TSchema>,
  //   options: CreateIndexesOptions,
  //   callback: Callback<string>
  // ): void
  // /**
  //  * Creates multiple indexes in the collection, this method is only supported for
  //  * MongoDB 2.6 or higher. Earlier version of MongoDB will throw a command not supported
  //  * error.
  //  *
  //  * **Note**: Unlike {@link Collection#createIndex| createIndex}, this function takes in raw index specifications.
  //  * Index specifications are defined {@link http://docs.mongodb.org/manual/reference/command/createIndexes/| here}.
  //  *
  //  * @param indexSpecs - An array of index specifications to be created
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  *
  //  * @example
  //  * ```js
  //  * const collection = client.db('foo').collection('bar');
  //  * await collection.createIndexes([
  //  *   // Simple index on field fizz
  //  *   {
  //  *     key: { fizz: 1 },
  //  *   }
  //  *   // wildcard index
  //  *   {
  //  *     key: { '$**': 1 }
  //  *   },
  //  *   // named index on darmok and jalad
  //  *   {
  //  *     key: { darmok: 1, jalad: -1 }
  //  *     name: 'tanagra'
  //  *   }
  //  * ]);
  //  * ```
  //  */
  // createIndexes(indexSpecs: IndexDescription[]): Promise<string[]>
  // createIndexes(
  //   indexSpecs: IndexDescription[],
  //   callback: Callback<string[]>
  // ): void
  // createIndexes(
  //   indexSpecs: IndexDescription[],
  //   options: CreateIndexesOptions
  // ): Promise<string[]>
  // createIndexes(
  //   indexSpecs: IndexDescription[],
  //   options: CreateIndexesOptions,
  //   callback: Callback<string[]>
  // ): void
  // /**
  //  * Drops an index from this collection.
  //  *
  //  * @param indexName - Name of the index to drop.
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  */
  // dropIndex(indexName: string): Promise<Document>
  // dropIndex(indexName: string, callback: Callback<Document>): void
  // dropIndex(indexName: string, options: DropIndexesOptions): Promise<Document>
  // dropIndex(
  //   indexName: string,
  //   options: DropIndexesOptions,
  //   callback: Callback<Document>
  // ): void
  // /**
  //  * Drops all indexes from this collection.
  //  *
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  */
  // dropIndexes(): Promise<Document>
  // dropIndexes(callback: Callback<Document>): void
  // dropIndexes(options: DropIndexesOptions): Promise<Document>
  // dropIndexes(options: DropIndexesOptions, callback: Callback<Document>): void
  // /**
  //  * Get the list of all indexes information for the collection.
  //  *
  //  * @param options - Optional settings for the command
  //  */
  // listIndexes(options?: ListIndexesOptions): ListIndexesCursor
  // /**
  //  * Checks if one or more indexes exist on the collection, fails on first non-existing index
  //  *
  //  * @param indexes - One or more index names to check.
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  */
  // indexExists(indexes: string | string[]): Promise<boolean>
  // indexExists(indexes: string | string[], callback: Callback<boolean>): void
  // indexExists(
  //   indexes: string | string[],
  //   options: IndexInformationOptions
  // ): Promise<boolean>
  // indexExists(
  //   indexes: string | string[],
  //   options: IndexInformationOptions,
  //   callback: Callback<boolean>
  // ): void
  // /**
  //  * Retrieves this collections index info.
  //  *
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  */
  // indexInformation(): Promise<Document>
  // indexInformation(callback: Callback<Document>): void
  // indexInformation(options: IndexInformationOptions): Promise<Document>
  // indexInformation(
  //   options: IndexInformationOptions,
  //   callback: Callback<Document>
  // ): void
  /**
   * Gets the number of documents matching the filter.
   * For a fast count of the total documents in a collection see {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
   * **Note**: When migrating from {@link Collection#count| count} to {@link Collection#countDocuments| countDocuments}
   * the following query operators must be replaced:
   *
   * | Operator | Replacement |
   * | -------- | ----------- |
   * | `$where`   | [`$expr`][1] |
   * | `$near`    | [`$geoWithin`][2] with [`$center`][3] |
   * | `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |
   *
   * [1]: https://docs.mongodb.com/manual/reference/operator/query/expr/
   * [2]: https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
   * [3]: https://docs.mongodb.com/manual/reference/operator/query/center/#op._S_center
   * [4]: https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
   *
   * @param filter - The filter for the count
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   *
   * @see https://docs.mongodb.com/manual/reference/operator/query/expr/
   * @see https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
   * @see https://docs.mongodb.com/manual/reference/operator/query/center/#op._S_center
   * @see https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
   */
  countDocuments(): Promise<number>
  countDocuments(callback: Callback<number>): void
  countDocuments(filter: Filter<TSchema>): Promise<number>
  countDocuments(callback: Callback<number>): void
  countDocuments(
    filter: Filter<TSchema>,
    options: CountDocumentsOptions
  ): Promise<number>
  countDocuments(
    filter: Filter<TSchema>,
    options: CountDocumentsOptions,
    callback: Callback<number>
  ): void
  countDocuments(filter: Filter<TSchema>, callback: Callback<number>): void
  /**
   * The distinct command returns a list of distinct values for the given key across a collection.
   *
   * @param key - Field of the document to find distinct values for
   * @param filter - The filter for filtering the set of documents to which we apply the distinct filter.
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key
  ): Promise<Array<Flatten<WithId<TSchema>[Key]>>>
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>
  ): void
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    filter: Filter<TSchema>
  ): Promise<Array<Flatten<WithId<TSchema>[Key]>>>
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    filter: Filter<TSchema>,
    callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>
  ): void
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    filter: Filter<TSchema>,
    options: DistinctOptions
  ): Promise<Array<Flatten<WithId<TSchema>[Key]>>>
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    filter: Filter<TSchema>,
    options: DistinctOptions,
    callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>
  ): void
  distinct(key: string): Promise<any[]>
  distinct(key: string, callback: Callback<any[]>): void
  distinct(key: string, filter: Filter<TSchema>): Promise<any[]>
  distinct(
    key: string,
    filter: Filter<TSchema>,
    callback: Callback<any[]>
  ): void
  distinct(
    key: string,
    filter: Filter<TSchema>,
    options: DistinctOptions
  ): Promise<any[]>
  distinct(
    key: string,
    filter: Filter<TSchema>,
    options: DistinctOptions,
    callback: Callback<any[]>
  ): void
  // /**
  //  * Retrieve all the indexes on the collection.
  //  *
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  */
  // indexes(): Promise<Document[]>
  // indexes(callback: Callback<Document[]>): void
  // indexes(options: IndexInformationOptions): Promise<Document[]>
  // indexes(
  //   options: IndexInformationOptions,
  //   callback: Callback<Document[]>
  // ): void
  /**
   * Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.
   *
   * @param filter - The filter used to select the document to remove
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  findOneAndDelete(filter: Filter<TSchema>): Promise<ModifyResult<TSchema>>
  findOneAndDelete(
    filter: Filter<TSchema>,
    options: TsFindOneAndDeleteOptions<TSchema>
  ): Promise<ModifyResult<TSchema>>
  findOneAndDelete(
    filter: Filter<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  findOneAndDelete(
    filter: Filter<TSchema>,
    options: TsFindOneAndDeleteOptions<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  /**
   * Find a document and replace it in one atomic operation. Requires a write lock for the duration of the operation.
   *
   * @param filter - The filter used to select the document to replace
   * @param replacement - The Document that replaces the matching document
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  findOneAndReplace(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>
  ): Promise<ModifyResult<TSchema>>
  findOneAndReplace(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  findOneAndReplace(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>,
    options: TsFindOneAndReplaceOptions<TSchema>
  ): Promise<ModifyResult<TSchema>>
  findOneAndReplace(
    filter: Filter<TSchema>,
    replacement: WithoutId<TSchema>,
    options: TsFindOneAndReplaceOptions<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  /**
   * Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
   *
   * @param filter - The filter used to select the document to update
   * @param update - Update operations to be performed on the document
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  findOneAndUpdate(
    filter: Filter<TSchema>,
    update: Update<TSchema>
  ): Promise<ModifyResult<TSchema>>
  findOneAndUpdate(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  findOneAndUpdate(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    options: TsFindOneAndUpdateOptions<TSchema>
  ): Promise<ModifyResult<TSchema>>
  findOneAndUpdate(
    filter: Filter<TSchema>,
    update: Update<TSchema>,
    options: TsFindOneAndUpdateOptions<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  // /**
  //  * Execute an aggregation framework pipeline against the collection, needs MongoDB \>= 2.2
  //  *
  //  * @param pipeline - An array of aggregation pipelines to execute
  //  * @param options - Optional settings for the command
  //  */
  // aggregate<T = Document>(
  //   pipeline?: Document[],
  //   options?: AggregateOptions
  // ): AggregationCursor<T>
  // /**
  //  * Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.
  //  *
  //  * @since 3.0.0
  //  * @param pipeline - An array of {@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
  //  * @param options - Optional settings for the command
  //  */
  // watch<TLocal = TSchema>(
  //   pipeline?: Document[],
  //   options?: ChangeStreamOptions
  // ): ChangeStream<TLocal>
  // /**
  //  * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
  //  *
  //  * @deprecated collection.mapReduce is deprecated. Use the aggregation pipeline instead. Visit https://docs.mongodb.com/manual/reference/map-reduce-to-aggregation-pipeline for more information on how to translate map-reduce operations to the aggregation pipeline.
  //  * @param map - The mapping function.
  //  * @param reduce - The reduce function.
  //  * @param options - Optional settings for the command
  //  * @param callback - An optional callback, a Promise will be returned if none is provided
  //  */
  // mapReduce<TKey = any, TValue = any>(
  //   map: string | MapFunction<TSchema>,
  //   reduce: string | ReduceFunction<TKey, TValue>
  // ): Promise<Document | Document[]>
  // mapReduce<TKey = any, TValue = any>(
  //   map: string | MapFunction<TSchema>,
  //   reduce: string | ReduceFunction<TKey, TValue>,
  //   callback: Callback<Document | Document[]>
  // ): void
  // mapReduce<TKey = any, TValue = any>(
  //   map: string | MapFunction<TSchema>,
  //   reduce: string | ReduceFunction<TKey, TValue>,
  //   options: MapReduceOptions<TKey, TValue>
  // ): Promise<Document | Document[]>
  // mapReduce<TKey = any, TValue = any>(
  //   map: string | MapFunction<TSchema>,
  //   reduce: string | ReduceFunction<TKey, TValue>,
  //   options: MapReduceOptions<TKey, TValue>,
  //   callback: Callback<Document | Document[]>
  // ): void
}
