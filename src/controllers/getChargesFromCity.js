import getDb from '../db'

import validator from './validator'
import { computeMeanForCombination, getCondoSizeDb } from './helpers'

export default async ctx => {
  // Input validation
  const { dptCode, cityCode } = ctx.params
  const { error, value: search } = validator(ctx.query)

  if (error) {
    ctx.status = 403
    ctx.body = error.details[0].message
    return
  }

  const db = await getDb()

  // Let's look for the city first
  const city = await db.collection('city').findOne({ dpt_code: dptCode, postal_code: cityCode })

  if (!city) {
    ctx.status = 404
    ctx.body = 'City not found'
    return
  }

  const { condoSize, heating, employee, elevator } = search
  const searchedCondoSize = getCondoSizeDb(condoSize)

  // We cannot calculate this, so let's be honest!
  if (['<10', '11-49'].includes(searchedCondoSize) && employee) {
    ctx.status = 400
    ctx.body = "Small buildings < 49 condos don't have stats for employee"
    return
  }

  const stats = await db
    .collection('baseStats')
    .findOne({ cityId: city.id, condo_size: searchedCondoSize })

  // No stats for the city & condo size, let's not try to estimate this & be honest
  if (!stats) {
    ctx.status = 404
    ctx.body = 'No stats for this city & condo size!'
    return
  }

  const { mean, std } = computeMeanForCombination({ heating, employee, elevator }, stats)

  ctx.body = {
    mean,
    min: mean - std,
    max: mean + std,
  }
}
