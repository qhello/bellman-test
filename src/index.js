import Koa from 'koa'

import config from './config'
import router from './routes'

const app = new Koa()

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.port)

console.log(`Service 'api' launched! 🚀`)
console.log(`Listening on port ${config.port}...`)
