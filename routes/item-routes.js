
import Router from 'koa-router'
import fs from 'fs-extra'

const router = new Router()

import Items from '../modules/items.js'
import Events from '../modules/events.js'
import Messages from '../modules/messages.js'
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
	ctx.hbs.item.id = itemID
	await item.close()

	//check if currently logged in user made event
	const userID = parseInt(ctx.hbs.authorised)
	const eventID = curItem.event_id
	const event = await new Events(dbName)
	ctx.hbs.owner = await event.eventBy(userID, eventID)
	await event.close()

	//retrieve questions about item
	const message = await new Messages(dbName)
	ctx.hbs.messages = await message.getMessages(itemID)
	await message.close()
	console.log(`messages: ${ctx.hbs.messages}`)

	//send data to template
	console.log(ctx.hbs)
	await ctx.render('itemdetails', ctx.hbs)
})

router.post('/sendpledge/:id', async ctx => {
	const item = await new Items(dbName)
	const itemID = parseInt(ctx.params.id)
	const donorID = parseInt(ctx.hbs.authorised)
	const body = ctx.request.body
	try {
		//call pledge function
		await item.pledgeItem(itemID, donorID)
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
	const body = ctx.request.body
	try {
		//copy image into correct directory
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

router.post('/sendThanks/:id', async ctx => {
	const item = await new Items(dbName)
	const itemID = parseInt(ctx.params.id)
	const curItem = await item.getItem(itemID) //this line enables access to donor id
	const body = ctx.request.body
	try {
		//call thanks function
		await item.thankDonor(itemID, curItem.donor_id)
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=sent thank you to donor successfully...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await item.close()
	}
})

export default router
