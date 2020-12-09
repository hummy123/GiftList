
import Router from 'koa-router'
import fs from 'fs-extra'

const router = new Router()

import Items from '../modules/items.js'
import Messages from '../modules/messages.js'
const dbName = 'website.db'

/**
 * Page to ask item about item.
 *
 * @name Ask Question
 * @route {GET} /
 */
router.get('/ask/:id', async ctx => {
	const itemID = parseInt(ctx.params.id)
	const item = await new Items(dbName)
	ctx.hbs.item = await item.getItem(itemID)
	console.log(ctx.hbs)
	await ctx.render('ask', ctx.hbs)
})

router.post('/ask/:id', async ctx => {
	//call memssage-ask function here and do the data handling
})

router.get('/answer/:id', async ctx => {
	//load answer-question .handlebars template
})

router.post('/answer/:id', async ctx => {
	//pass data along to the item.answer function
})

export default router
