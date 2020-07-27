import getDb from '../db'

export default async ctx => {
  const db = await getDb()

  // This gets an array of distincs values for all documents in collection, for the field "dpt_code"
  const departments = await db.collection('city').distinct('dpt_code')

  ctx.body = departments.filter(code => !!code).map(code => ({ dptCode: code }))
}
