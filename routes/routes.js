
import Router from 'koa-router'
import bodyParser from 'koa-body'

import publicRouter from './public.js'
import secureRouter from'./secure.js'
import eventRouter from './event-routes.js'
import itemRouter from './item-routes.js'
import messageRouter from './message-routes.js'

const mainRouter = new Router()
mainRouter.use(bodyParser({multipart: true}))

const nestedRoutes = [publicRouter, secureRouter, eventRouter, itemRouter, messageRouter]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter
