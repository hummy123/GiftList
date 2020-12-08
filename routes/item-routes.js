
import Router from 'koa-router'
import fs from 'fs-extra'

const router = new Router()

import Items from '../modules/items.js'
import Events from '../modules/events.js'
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
	//store item details
	const itemID = parseInt(ctx.params.id)
	const item = await new Items(dbName)
	const curItem = await item.getItem(itemID)
	ctx.hbs.item = curItem
	await item.close()

	//check if currently logged in user made event
	const userID = parseInt(ctx.hbs.authorised)
	const eventID = curItem.event_id
	console.log(curItem)
	console.log(userID)
	const event = await new Events(dbName)
	ctx.hbs.owner = await event.eventBy(userID, eventID)
	await event.close()

	//send data to template
	console.log(ctx.hbs)
	await ctx.render('itemdetails', ctx.hbs)
})

router.post('/sendpledge/:id', async ctx => {
	const item = await new Items(dbName)
	const itemID = parseInt(ctx.params.id)
	const donorID = parseInt(ctx.authorised)
	ctx.hbs.body = ctx.request.body
	try {
		//call pledge function
		await item.pledgeItem(itemID, donorID)
		const body = ctx.request.body
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=item pledged successfully...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await item.close()
	}
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
