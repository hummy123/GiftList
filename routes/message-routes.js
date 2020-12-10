
import Router from 'koa-router'
const router = new Router()

import Items from '../modules/items.js'
import Messages from '../modules/messages.js'
const dbName = 'website.db'

/**
 * Page to ask question about item.
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
	const body = ctx.request.body
	try {
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
	const messageID = parseInt(ctx.params.id)
	const message = await new Messages(dbName)
	ctx.hbs.message = await message.getMessage(messageID)
	console.log(ctx.hbs)
	await ctx.render('answer', ctx.hbs)
})

router.post('/answer/:id', async ctx => {
	const messageID = parseInt(ctx.params.id)
	const message = await new Messages(dbName)
	ctx.hbs.body = ctx.request.body
	const body = ctx.request.body
	try {
		//update message with answer
		await message.answer(body.answer, messageID)
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=answer sent succsessfully...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await message.close()
	}
})

export default router
