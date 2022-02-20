import {
  AggregateOptions,
  AggregationCursor,
  BSONSerializeOptions,
  BulkWriteOptions,
  BulkWriteResult,
  Callback,
  ChangeStream,
  ChangeStreamOptions,
  CollationOptions,
  Collection,
  CollectionOptions,
  CollStats,
  CollStatsOptions,
  Condition,
  CountDocumentsOptions,
  CountOptions,
  CreateIndexesOptions,
  Db,
  DeleteOptions,
  DeleteResult,
  DistinctOptions,
  Document,
  DropCollectionOptions,
  DropIndexesOptions,
  EstimatedDocumentCountOptions,
  FindCursor,
  FindOneAndDeleteOptions,
  FindOneAndReplaceOptions,
  FindOneAndUpdateOptions,
  FindOptions,
  Flatten,
  Hint,
  IndexDescription,
  IndexInformationOptions,
  IndexSpecification,
  InsertManyResult,
  InsertOneModel,
  InsertOneOptions,
  InsertOneResult,
  Join,
  ListIndexesCursor,
  ListIndexesOptions,
  Logger,
  MapFunction,
  MapReduceOptions,
  ModifyResult,
  NestedPaths,
  OperationOptions,
  OptionalUnlessRequiredId,
  OrderedBulkOperation,
  PropertyType,
  ReadConcern,
  ReadPreference,
  ReduceFunction,
  RenameOptions,
  ReplaceOptions,
  UnorderedBulkOperation,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
  WithId,
  WithoutId,
  WriteConcern,
} from 'mongodb'

// TODO: check if UpdateFilter is OK to keep

/** @public */
export declare interface TsReplaceOneModel<
  TSchema extends Document = Document
> {
  /** The filter to limit the replaced document. */
  filter: TsFilter<TSchema>
  /** The document with which to replace the matched document. */
  replacement: WithoutId<TSchema>
  /** Specifies a collation. */
  collation?: CollationOptions
  /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
  hint?: Hint
  /** When true, creates a new document if no document matches the query. */
  upsert?: boolean
}

/** @public */
export declare interface TsUpdateOneModel<TSchema extends Document = Document> {
  /** The filter to limit the updated documents. */
  filter: TsFilter<TSchema>
  /** A document or pipeline containing update operators. */
  update: UpdateFilter<TSchema> | UpdateFilter<TSchema>[]
  /** A set of filters specifying to which array elements an update should apply. */
  arrayFilters?: Document[]
  /** Specifies a collation. */
  collation?: CollationOptions
  /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
  hint?: Hint
  /** When true, creates a new document if no document matches the query. */
  upsert?: boolean
}

/** @public */
export declare interface TsUpdateManyModel<
  TSchema extends Document = Document
> {
  /** The filter to limit the updated documents. */
  filter: TsFilter<TSchema>
  /** A document or pipeline containing update operators. */
  update: UpdateFilter<TSchema> | UpdateFilter<TSchema>[]
  /** A set of filters specifying to which array elements an update should apply. */
  arrayFilters?: Document[]
  /** Specifies a collation. */
  collation?: CollationOptions
  /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
  hint?: Hint
  /** When true, creates a new document if no document matches the query. */
  upsert?: boolean
}

/** @public */
export declare interface TsDeleteOneModel<TSchema extends Document = Document> {
  /** The filter to limit the deleted documents. */
  filter: TsFilter<TSchema>
  /** Specifies a collation. */
  collation?: CollationOptions
  /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
  hint?: Hint
}

/** @public */
export declare interface TsDeleteManyModel<
  TSchema extends Document = Document
> {
  /** The filter to limit the deleted documents. */
  filter: TsFilter<TSchema>
  /** Specifies a collation. */
  collation?: CollationOptions
  /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
  hint?: Hint
}

/** @public */
export declare type AnyBulkWriteOperation<TSchema extends Document = Document> =

    | {
        insertOne: InsertOneModel<TSchema>
      }
    | {
        replaceOne: TsReplaceOneModel<TSchema>
      }
    | {
        updateOne: TsUpdateOneModel<TSchema>
      }
    | {
        updateMany: TsUpdateManyModel<TSchema>
      }
    | {
        deleteOne: TsDeleteOneModel<TSchema>
      }
    | {
        deleteMany: TsDeleteManyModel<TSchema>
      }

export declare interface TsRootFilterOperators<TSchema extends Document> {
  $and?: TsFilter<TSchema>[]
  $nor?: TsFilter<TSchema>[]
  $or?: TsFilter<TSchema>[]
  $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
  $where?: string | ((this: TSchema) => boolean)
  $comment?: string | Document
}

export declare type TsFilter<TSchema extends Document> =
  | Partial<TSchema>
  | ({
      [Property in Join<NestedPaths<WithId<TSchema>>, '.'>]?: Condition<
        PropertyType<WithId<TSchema>, Property>
      >
    } & TsRootFilterOperators<WithId<TSchema>>)

interface TsCollection<TSchema extends Document = Document>
  extends Collection<TSchema> {
  dangerous: Collection<TSchema>

  /* Excluded from this release type: s */
  /* Excluded from this release type: __constructor */
  /**
   * The name of the database this collection belongs to
   */
  get dbName(): string
  /**
   * The name of this collection
   */
  get collectionName(): string
  /**
   * The namespace of this collection, in the format `${this.dbName}.${this.collectionName}`
   */
  get namespace(): string
  /**
   * The current readConcern of the collection. If not explicitly defined for
   * this collection, will be inherited from the parent DB
   */
  get readConcern(): ReadConcern | undefined
  /**
   * The current readPreference of the collection. If not explicitly defined for
   * this collection, will be inherited from the parent DB
   */
  get readPreference(): ReadPreference | undefined
  get bsonOptions(): BSONSerializeOptions
  /**
   * The current writeConcern of the collection. If not explicitly defined for
   * this collection, will be inherited from the parent DB
   */
  get writeConcern(): WriteConcern | undefined
  /** The current index hint for the collection */
  get hint(): Hint | undefined
  set hint(v: Hint | undefined)

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
   * Perform a bulkWrite operation without a fluent API
   *
   * Legal operation types are
   *
   * ```js
   *  { insertOne: { document: { a: 1 } } }
   *
   *  { updateOne: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
   *
   *  { updateMany: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
   *
   *  { updateMany: { filter: {}, update: {$set: {"a.$[i].x": 5}}, arrayFilters: [{ "i.x": 5 }]} }
   *
   *  { deleteOne: { filter: {c:1} } }
   *
   *  { deleteMany: { filter: {c:1} } }
   *
   *  { replaceOne: { filter: {c:3}, replacement: {c:4}, upsert:true} }
   *```
   * Please note that raw operations are no longer accepted as of driver version 4.0.
   *
   * If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @param operations - Bulk operations to perform
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   * @throws MongoDriverError if operations is not an array
   */
  bulkWrite(
    operations: AnyBulkWriteOperation<TSchema>[]
  ): Promise<BulkWriteResult>
  bulkWrite(
    operations: AnyBulkWriteOperation<TSchema>[],
    callback: Callback<BulkWriteResult>
  ): void
  bulkWrite(
    operations: AnyBulkWriteOperation<TSchema>[],
    options: BulkWriteOptions
  ): Promise<BulkWriteResult>
  bulkWrite(
    operations: AnyBulkWriteOperation<TSchema>[],
    options: BulkWriteOptions,
    callback: Callback<BulkWriteResult>
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
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema> | Partial<TSchema>
  ): Promise<UpdateResult>
  updateOne(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema> | Partial<TSchema>,
    callback: Callback<UpdateResult>
  ): void
  updateOne(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema> | Partial<TSchema>,
    options: UpdateOptions
  ): Promise<UpdateResult>
  updateOne(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema> | Partial<TSchema>,
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
    filter: TsFilter<TSchema>,
    replacement: WithoutId<TSchema>
  ): Promise<UpdateResult | Document>
  replaceOne(
    filter: TsFilter<TSchema>,
    replacement: WithoutId<TSchema>,
    callback: Callback<UpdateResult | Document>
  ): void
  replaceOne(
    filter: TsFilter<TSchema>,
    replacement: WithoutId<TSchema>,
    options: ReplaceOptions
  ): Promise<UpdateResult | Document>
  replaceOne(
    filter: TsFilter<TSchema>,
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
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>
  ): Promise<UpdateResult | Document>
  updateMany(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>,
    callback: Callback<UpdateResult | Document>
  ): void
  updateMany(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>,
    options: UpdateOptions
  ): Promise<UpdateResult | Document>
  updateMany(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>,
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
  deleteOne(filter: TsFilter<TSchema>): Promise<DeleteResult>
  deleteOne(filter: TsFilter<TSchema>, callback: Callback<DeleteResult>): void
  deleteOne(
    filter: TsFilter<TSchema>,
    options: DeleteOptions
  ): Promise<DeleteResult>
  deleteOne(
    filter: TsFilter<TSchema>,
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
  deleteMany(filter: TsFilter<TSchema>): Promise<DeleteResult>
  deleteMany(filter: TsFilter<TSchema>, callback: Callback<DeleteResult>): void
  deleteMany(
    filter: TsFilter<TSchema>,
    options: DeleteOptions
  ): Promise<DeleteResult>
  deleteMany(
    filter: TsFilter<TSchema>,
    options: DeleteOptions,
    callback: Callback<DeleteResult>
  ): void
  /**
   * Rename the collection.
   *
   * @remarks
   * This operation does not inherit options from the Db or MongoClient.
   *
   * @param newName - New name of of the collection.
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  rename(newName: string): Promise<Collection>
  rename(newName: string, callback: Callback<Collection>): void
  rename(newName: string, options: RenameOptions): Promise<Collection>
  rename(
    newName: string,
    options: RenameOptions,
    callback: Callback<Collection>
  ): void
  /**
   * Drop the collection from the database, removing it permanently. New accesses will create a new collection.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  drop(): Promise<boolean>
  drop(callback: Callback<boolean>): void
  drop(options: DropCollectionOptions): Promise<boolean>
  drop(options: DropCollectionOptions, callback: Callback<boolean>): void
  /**
   * Fetches the first document that matches the filter
   *
   * @param filter - Query for find Operation
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  findOne(): Promise<WithId<TSchema> | null>
  findOne(callback: Callback<WithId<TSchema> | null>): void
  findOne(filter: TsFilter<TSchema>): Promise<WithId<TSchema> | null>
  findOne(
    filter: TsFilter<TSchema>,
    callback: Callback<WithId<TSchema> | null>
  ): void
  findOne(
    filter: TsFilter<TSchema>,
    options: FindOptions
  ): Promise<WithId<TSchema> | null>
  findOne(
    filter: TsFilter<TSchema>,
    options: FindOptions,
    callback: Callback<WithId<TSchema> | null>
  ): void
  findOne<T = TSchema>(): Promise<T | null>
  findOne<T = TSchema>(callback: Callback<T | null>): void
  findOne<T = TSchema>(filter: TsFilter<TSchema>): Promise<T | null>
  findOne<T = TSchema>(
    filter: TsFilter<TSchema>,
    options?: FindOptions
  ): Promise<T | null>
  findOne<T = TSchema>(
    filter: TsFilter<TSchema>,
    options?: FindOptions,
    callback?: Callback<T | null>
  ): void
  /**
   * Creates a cursor for a filter that can be used to iterate over results from MongoDB
   *
   * @param filter - The filter predicate. If unspecified, then all documents in the collection will match the predicate
   */
  find(): FindCursor<WithId<TSchema>>
  find(
    filter: TsFilter<TSchema>,
    options?: FindOptions
  ): FindCursor<WithId<TSchema>>
  find<T>(filter: TsFilter<TSchema>, options?: FindOptions): FindCursor<T>
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
  /**
   * Returns if the collection is a capped collection
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  isCapped(): Promise<boolean>
  isCapped(callback: Callback<boolean>): void
  isCapped(options: OperationOptions): Promise<boolean>
  isCapped(options: OperationOptions, callback: Callback<boolean>): void
  /**
   * Creates an index on the db and collection collection.
   *
   * @param indexSpec - The field name or index specification to create an index for
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   *
   * @example
   * ```js
   * const collection = client.db('foo').collection('bar');
   *
   * await collection.createIndex({ a: 1, b: -1 });
   *
   * // Alternate syntax for { c: 1, d: -1 } that ensures order of indexes
   * await collection.createIndex([ [c, 1], [d, -1] ]);
   *
   * // Equivalent to { e: 1 }
   * await collection.createIndex('e');
   *
   * // Equivalent to { f: 1, g: 1 }
   * await collection.createIndex(['f', 'g'])
   *
   * // Equivalent to { h: 1, i: -1 }
   * await collection.createIndex([ { h: 1 }, { i: -1 } ]);
   *
   * // Equivalent to { j: 1, k: -1, l: 2d }
   * await collection.createIndex(['j', ['k', -1], { l: '2d' }])
   * ```
   */
  createIndex(indexSpec: IndexSpecification): Promise<string>
  createIndex(indexSpec: IndexSpecification, callback: Callback<string>): void
  createIndex(
    indexSpec: IndexSpecification,
    options: CreateIndexesOptions
  ): Promise<string>
  createIndex(
    indexSpec: IndexSpecification,
    options: CreateIndexesOptions,
    callback: Callback<string>
  ): void
  /**
   * Creates multiple indexes in the collection, this method is only supported for
   * MongoDB 2.6 or higher. Earlier version of MongoDB will throw a command not supported
   * error.
   *
   * **Note**: Unlike {@link Collection#createIndex| createIndex}, this function takes in raw index specifications.
   * Index specifications are defined {@link http://docs.mongodb.org/manual/reference/command/createIndexes/| here}.
   *
   * @param indexSpecs - An array of index specifications to be created
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   *
   * @example
   * ```js
   * const collection = client.db('foo').collection('bar');
   * await collection.createIndexes([
   *   // Simple index on field fizz
   *   {
   *     key: { fizz: 1 },
   *   }
   *   // wildcard index
   *   {
   *     key: { '$**': 1 }
   *   },
   *   // named index on darmok and jalad
   *   {
   *     key: { darmok: 1, jalad: -1 }
   *     name: 'tanagra'
   *   }
   * ]);
   * ```
   */
  createIndexes(indexSpecs: IndexDescription[]): Promise<string[]>
  createIndexes(
    indexSpecs: IndexDescription[],
    callback: Callback<string[]>
  ): void
  createIndexes(
    indexSpecs: IndexDescription[],
    options: CreateIndexesOptions
  ): Promise<string[]>
  createIndexes(
    indexSpecs: IndexDescription[],
    options: CreateIndexesOptions,
    callback: Callback<string[]>
  ): void
  /**
   * Drops an index from this collection.
   *
   * @param indexName - Name of the index to drop.
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  dropIndex(indexName: string): Promise<Document>
  dropIndex(indexName: string, callback: Callback<Document>): void
  dropIndex(indexName: string, options: DropIndexesOptions): Promise<Document>
  dropIndex(
    indexName: string,
    options: DropIndexesOptions,
    callback: Callback<Document>
  ): void
  /**
   * Drops all indexes from this collection.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  dropIndexes(): Promise<Document>
  dropIndexes(callback: Callback<Document>): void
  dropIndexes(options: DropIndexesOptions): Promise<Document>
  dropIndexes(options: DropIndexesOptions, callback: Callback<Document>): void
  /**
   * Get the list of all indexes information for the collection.
   *
   * @param options - Optional settings for the command
   */
  listIndexes(options?: ListIndexesOptions): ListIndexesCursor
  /**
   * Checks if one or more indexes exist on the collection, fails on first non-existing index
   *
   * @param indexes - One or more index names to check.
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  indexExists(indexes: string | string[]): Promise<boolean>
  indexExists(indexes: string | string[], callback: Callback<boolean>): void
  indexExists(
    indexes: string | string[],
    options: IndexInformationOptions
  ): Promise<boolean>
  indexExists(
    indexes: string | string[],
    options: IndexInformationOptions,
    callback: Callback<boolean>
  ): void
  /**
   * Retrieves this collections index info.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  indexInformation(): Promise<Document>
  indexInformation(callback: Callback<Document>): void
  indexInformation(options: IndexInformationOptions): Promise<Document>
  indexInformation(
    options: IndexInformationOptions,
    callback: Callback<Document>
  ): void
  /**
   * Gets an estimate of the count of documents in a collection using collection metadata.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  estimatedDocumentCount(): Promise<number>
  estimatedDocumentCount(callback: Callback<number>): void
  estimatedDocumentCount(
    options: EstimatedDocumentCountOptions
  ): Promise<number>
  estimatedDocumentCount(
    options: EstimatedDocumentCountOptions,
    callback: Callback<number>
  ): void
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
  countDocuments(filter: TsFilter<TSchema>): Promise<number>
  countDocuments(callback: Callback<number>): void
  countDocuments(
    filter: TsFilter<TSchema>,
    options: CountDocumentsOptions
  ): Promise<number>
  countDocuments(
    filter: TsFilter<TSchema>,
    options: CountDocumentsOptions,
    callback: Callback<number>
  ): void
  countDocuments(filter: TsFilter<TSchema>, callback: Callback<number>): void
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
    filter: TsFilter<TSchema>
  ): Promise<Array<Flatten<WithId<TSchema>[Key]>>>
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    filter: TsFilter<TSchema>,
    callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>
  ): void
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    filter: TsFilter<TSchema>,
    options: DistinctOptions
  ): Promise<Array<Flatten<WithId<TSchema>[Key]>>>
  distinct<Key extends keyof WithId<TSchema>>(
    key: Key,
    filter: TsFilter<TSchema>,
    options: DistinctOptions,
    callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>
  ): void
  distinct(key: string): Promise<any[]>
  distinct(key: string, callback: Callback<any[]>): void
  distinct(key: string, filter: TsFilter<TSchema>): Promise<any[]>
  distinct(
    key: string,
    filter: TsFilter<TSchema>,
    callback: Callback<any[]>
  ): void
  distinct(
    key: string,
    filter: TsFilter<TSchema>,
    options: DistinctOptions
  ): Promise<any[]>
  distinct(
    key: string,
    filter: TsFilter<TSchema>,
    options: DistinctOptions,
    callback: Callback<any[]>
  ): void
  /**
   * Retrieve all the indexes on the collection.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  indexes(): Promise<Document[]>
  indexes(callback: Callback<Document[]>): void
  indexes(options: IndexInformationOptions): Promise<Document[]>
  indexes(
    options: IndexInformationOptions,
    callback: Callback<Document[]>
  ): void
  /**
   * Get all the collection statistics.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  stats(): Promise<CollStats>
  stats(callback: Callback<CollStats>): void
  stats(options: CollStatsOptions): Promise<CollStats>
  stats(options: CollStatsOptions, callback: Callback<CollStats>): void
  /**
   * Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.
   *
   * @param filter - The filter used to select the document to remove
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  findOneAndDelete(filter: TsFilter<TSchema>): Promise<ModifyResult<TSchema>>
  findOneAndDelete(
    filter: TsFilter<TSchema>,
    options: FindOneAndDeleteOptions
  ): Promise<ModifyResult<TSchema>>
  findOneAndDelete(
    filter: TsFilter<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  findOneAndDelete(
    filter: TsFilter<TSchema>,
    options: FindOneAndDeleteOptions,
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
    filter: TsFilter<TSchema>,
    replacement: WithoutId<TSchema>
  ): Promise<ModifyResult<TSchema>>
  findOneAndReplace(
    filter: TsFilter<TSchema>,
    replacement: WithoutId<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  findOneAndReplace(
    filter: TsFilter<TSchema>,
    replacement: WithoutId<TSchema>,
    options: FindOneAndReplaceOptions
  ): Promise<ModifyResult<TSchema>>
  findOneAndReplace(
    filter: TsFilter<TSchema>,
    replacement: WithoutId<TSchema>,
    options: FindOneAndReplaceOptions,
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
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>
  ): Promise<ModifyResult<TSchema>>
  findOneAndUpdate(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  findOneAndUpdate(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>,
    options: FindOneAndUpdateOptions
  ): Promise<ModifyResult<TSchema>>
  findOneAndUpdate(
    filter: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>,
    options: FindOneAndUpdateOptions,
    callback: Callback<ModifyResult<TSchema>>
  ): void
  /**
   * Execute an aggregation framework pipeline against the collection, needs MongoDB \>= 2.2
   *
   * @param pipeline - An array of aggregation pipelines to execute
   * @param options - Optional settings for the command
   */
  aggregate<T = Document>(
    pipeline?: Document[],
    options?: AggregateOptions
  ): AggregationCursor<T>
  /**
   * Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.
   *
   * @since 3.0.0
   * @param pipeline - An array of {@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
   * @param options - Optional settings for the command
   */
  watch<TLocal = TSchema>(
    pipeline?: Document[],
    options?: ChangeStreamOptions
  ): ChangeStream<TLocal>
  /**
   * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
   *
   * @deprecated collection.mapReduce is deprecated. Use the aggregation pipeline instead. Visit https://docs.mongodb.com/manual/reference/map-reduce-to-aggregation-pipeline for more information on how to translate map-reduce operations to the aggregation pipeline.
   * @param map - The mapping function.
   * @param reduce - The reduce function.
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  mapReduce<TKey = any, TValue = any>(
    map: string | MapFunction<TSchema>,
    reduce: string | ReduceFunction<TKey, TValue>
  ): Promise<Document | Document[]>
  mapReduce<TKey = any, TValue = any>(
    map: string | MapFunction<TSchema>,
    reduce: string | ReduceFunction<TKey, TValue>,
    callback: Callback<Document | Document[]>
  ): void
  mapReduce<TKey = any, TValue = any>(
    map: string | MapFunction<TSchema>,
    reduce: string | ReduceFunction<TKey, TValue>,
    options: MapReduceOptions<TKey, TValue>
  ): Promise<Document | Document[]>
  mapReduce<TKey = any, TValue = any>(
    map: string | MapFunction<TSchema>,
    reduce: string | ReduceFunction<TKey, TValue>,
    options: MapReduceOptions<TKey, TValue>,
    callback: Callback<Document | Document[]>
  ): void
  /** Initiate an Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order. */
  initializeUnorderedBulkOp(options?: BulkWriteOptions): UnorderedBulkOperation
  /** Initiate an In order bulk write operation. Operations will be serially executed in the order they are added, creating a new operation for each switch in types. */
  initializeOrderedBulkOp(options?: BulkWriteOptions): OrderedBulkOperation
  /** Get the db scoped logger */
  getLogger(): Logger
  get logger(): Logger
  /**
   * Inserts a single document or a an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @deprecated Use insertOne, insertMany or bulkWrite instead.
   * @param docs - The documents to insert
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  insert(
    docs: OptionalUnlessRequiredId<TSchema>[],
    options: BulkWriteOptions,
    callback: Callback<InsertManyResult<TSchema>>
  ): Promise<InsertManyResult<TSchema>> | void
  /**
   * Updates documents.
   *
   * @deprecated use updateOne, updateMany or bulkWrite
   * @param selector - The selector for the update operation.
   * @param update - The update operations to be applied to the documents
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  update(
    selector: TsFilter<TSchema>,
    update: UpdateFilter<TSchema>,
    options: UpdateOptions,
    callback: Callback<Document>
  ): Promise<UpdateResult> | void
  /**
   * Remove documents.
   *
   * @deprecated use deleteOne, deleteMany or bulkWrite
   * @param selector - The selector for the update operation.
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  remove(
    selector: TsFilter<TSchema>,
    options: DeleteOptions,
    callback: Callback
  ): Promise<DeleteResult> | void
  /**
   * An estimated count of matching documents in the db to a filter.
   *
   * **NOTE:** This method has been deprecated, since it does not provide an accurate count of the documents
   * in a collection. To obtain an accurate count of documents in the collection, use {@link Collection#countDocuments| countDocuments}.
   * To obtain an estimated count of all documents in the collection, use {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
   *
   * @deprecated use {@link Collection#countDocuments| countDocuments} or {@link Collection#estimatedDocumentCount| estimatedDocumentCount} instead
   *
   * @param filter - The filter for the count.
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  count(): Promise<number>
  count(callback: Callback<number>): void
  count(filter: TsFilter<TSchema>): Promise<number>
  count(filter: TsFilter<TSchema>, callback: Callback<number>): void
  count(filter: TsFilter<TSchema>, options: CountOptions): Promise<number>
  count(
    filter: TsFilter<TSchema>,
    options: CountOptions,
    callback: Callback<number>
  ): Promise<number> | void
}

export const mkTsCollection = <ICollection>(
  db: Db,
  name: string,
  options?: CollectionOptions
) =>
  new Proxy(db.collection<ICollection>(name, options), {
    get(target, property: string) {
      if (property === 'dangerous') {
        return target
      } else {
        return target[property as keyof typeof target]
      }
    },
  }) as TsCollection<ICollection>
