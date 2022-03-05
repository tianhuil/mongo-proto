import { Db, ObjectId } from 'mongodb'
import { mkDbFactory } from '../common'
import { mkTsCollection, TsCollection } from '../ts-mongodb'

export interface BlobStr {
  size: number
  text: string
}

export interface BlobStrArr {
  size: number
  texts: string[]
}

const mkTsCollections = (db: Db) => ({
  blobStr: mkTsCollection<BlobStr>(db, 'size-testing-blob'),
  blobStrArr: mkTsCollection<BlobStrArr>(db, 'size-testing-blob-str-arr'),
})

export const mkDb = () => mkDbFactory(mkTsCollections)

export const sizes = [10, 100, 1000, 10000]

export const fetchIds = async <T extends { size: number }>(
  coll: TsCollection<T>,
  size: number
): Promise<ObjectId[]> => {
  const results = await coll.find({ size } as Partial<T>).project({ _id: 1 })

  return results.map((x) => x._id as ObjectId).toArray()
}
