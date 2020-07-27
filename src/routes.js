import Router from '@koa/router'

import getDepartments from './controllers/getDepartments'
import getCIties from './controllers/getCities'

import getChargesFromCity from './controllers/getChargesFromCity'
import getChargesFromDepartment from './controllers/getChargesFromDepartment'

const router = new Router()

router.get('/department', getDepartments)
router.get('/department/:dptCode', getCIties)

router.get('/department/:dptCode/city/:cityCode/charges', getChargesFromCity)
router.get('/department/:dptCode/charges', getChargesFromDepartment)

export default router
