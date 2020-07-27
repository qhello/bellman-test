import getDb from '../db'

export default async ctx => {
  // Input
  const { dptCode } = ctx.params

  const db = await getDb()

  const cities = await (
    await db.collection('city').find({ dpt_code: dptCode }, { fields: { postal_code: 1, name: 1 } })
  ).toArray()

  if (!cities) {
    ctx.status = 404
    return
  }

  ctx.body = cities.map(({ postal_code: postalCode, name: city }) => ({ city, postalCode }))
}
