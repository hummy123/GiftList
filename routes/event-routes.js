
import Router from 'koa-router'
import fs from 'fs-extra'

const router = new Router()

import Events from '../modules/events.js'
import Items from '../modules/items.js'
const dbName = 'website.db'

/**
 * Page to register new events.
 *
 * @name Create Event
 * @route {GET} /
 */
router.get('/newevent', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('newevent', ctx.hbs)
})

router.post('/newevent', async ctx => {
	const event = await new Events(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		//copy image into correct directory
		const body = ctx.request.body
		const image = ctx.request.files.image
		fs.copy(image.path, `public/uploads/${image.name}`)
		//date to appropriate format
		const date = new Date(body.date).toLocaleDateString()
		await event.newEvent(body.title, body.description, date, image.name, ctx.session.authorised)
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=event added successfully...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await event.close()
	}
})

router.get('/event/:id', async ctx => {
	const eventID = parseInt(ctx.params.id)
	const event = await new Events(dbName)
	ctx.hbs.event = await event.getEvent(eventID)
	await event.close()
	const item = await new Items(dbName)
	ctx.hbs.items = await item.getEventItems(eventID)
	console.log(ctx.hbs)
	const curUserID = ctx.hbs.authorised
	const creatorID = ctx.hbs.event.creator_id
	if(curUserID === creatorID) {
		ctx.hbs.owner = true
	} else {
		ctx.hbs.owner = false
	}
	await ctx.render('event', ctx.hbs)
})


export default router
