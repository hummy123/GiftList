
import Router from 'koa-router'
import fs from 'fs-extra'

const router = new Router()

import Items from '../modules/items.js'
const dbName = 'website.db'

/**
 * Page to add item to event wishlist.
 *
 * @name Create Item
 * @route {GET} /
 */
router.get('/newitem/:id', async ctx => {
	ctx.hbs.event_id = parseInt(ctx.params.id)
	console.log(ctx.hbs)
	await ctx.render('newitem', ctx.hbs)
})

router.get('/item/:id', async ctx => {
	const itemID = parseInt(ctx.params.id)
	const item = await new Items(dbName)
	ctx.hbs.item = await item.getItem(itemID)
	console.log(ctx.hbs)
	await ctx.render('itemdetails', ctx.hbs)
})

router.post('/newitem/:id', async ctx => {
	const item = await new Items(dbName)
	const eventID = parseInt(ctx.params.id)
	ctx.hbs.body = ctx.request.body
	try {
		//copy image into correct directory
		const body = ctx.request.body
		const image = ctx.request.files.image
		fs.copy(image.path, `public/uploads/items/${image.name}`)
		await item.newItem(body.name, body.price, image.name, body.link, eventID)
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=item added successfully...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await item.close()
	}
})

export default router
