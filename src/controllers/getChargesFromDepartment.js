/* eslint-disable no-continue */
import getDb from '../db'

import validator from './validator'
import { computeMeanForCombination, getCondoSizeDb } from './helpers'

export default async ctx => {
  // Input validation
  const { dptCode } = ctx.params
  const { error, value: search } = validator(ctx.query)

  if (error) {
    ctx.status = 403
    ctx.body = error.details[0].message
    return
  }

  // Let's look for the department's cities

  const db = await getDb()
  const cities = await (await db.collection('city').find({ dpt_code: dptCode })).toArray()

  if (!cities) {
    ctx.status = 404
    ctx.body = 'Department not found'
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

  // Now, for all cities in the department: compute their mean & standart deviation one-by-one
  // Then we will average all their mean & std, using condoCount as weight (more condo, more weight in the average)

  let meanSum = 0
  let stdSum = 0
  let count = 0

  // eslint-disable-next-line no-restricted-syntax
  for (const city of cities) {
    // eslint-disable-next-line no-await-in-loop
    const stats = await db
      .collection('baseStats')
      .findOne({ cityId: city.id, condo_size: searchedCondoSize })

    if (!stats) continue

    const { mean, std } = computeMeanForCombination({ heating, employee, elevator }, stats)

    if (!mean || !std) continue

    const condoCount = parseInt(stats.condo_count, 10)

    meanSum += mean * condoCount
    stdSum += std * condoCount
    count += condoCount
  }

  // We have all we need, let's compute the average (of averages, yes!)

  const mean = count ? Math.floor(meanSum / count) : 0
  const std = count ? Math.floor(stdSum / count) : 0

  ctx.body = {
    mean,
    min: mean - std,
    max: mean + std,
  }
}
