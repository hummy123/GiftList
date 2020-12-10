
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
	ctx.hbs.item.id = itemID
	console.log(ctx.hbs)
	await ctx.render('ask', ctx.hbs)
})

router.post('/ask/:id', async ctx => {
	const message = await new Messages(dbName)
	const itemID = parseInt(ctx.params.id)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		//create new message
		await message.ask(body.subject, body.question, itemID)
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=question sent succsessfully...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await message.close()
	}
})

router.get('/answer/:id', async ctx => {
	//load answer-question .handlebars template
})

router.post('/answer/:id', async ctx => {
	//pass data along to the item.answer function
})

export default router
