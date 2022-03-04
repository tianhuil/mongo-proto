import { Db, ObjectId, WithId } from 'mongodb'
import { mkDbFactory } from '../common'
import { mkTsCollection, TsCollection } from '../ts-mongodb'

export interface BlobStr {
  size: number
  text: string
}

const mkTsCollections = (db: Db) => ({
  blobStr: mkTsCollection<BlobStr>(db, 'size-testing-blob'),
})

export const mkDb = () => mkDbFactory(mkTsCollections)

export const sizes = [1, 10, 100]

export const fetchIds = async (
  blobStr: TsCollection<BlobStr>,
  size: number
): Promise<ObjectId[]> => {
  const results = await blobStr
    .find({ size })
    .project<Pick<WithId<BlobStr>, '_id'>>({ _id: 1 })

  return results.map((x) => x._id).toArray()
}
