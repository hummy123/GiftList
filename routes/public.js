
import Router from 'koa-router'
import fs from 'fs-extra'

const router = new Router()

import Accounts from '../modules/accounts.js'
import Events from '../modules/events.js'
const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	const event = await new Events(dbName)
	const eventList = await event.getEvents()
	ctx.hbs.events = eventList
	console.log(ctx.hbs)
	try {
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		await account.close()
	}
})

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

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
		fs.copy(image.path, `uploads/${image.name}`)
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

router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		const id = await account.login(body.user, body.pass)
		ctx.session.authorised = id
		const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		await account.close()
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = 0
	ctx.redirect('/?msg=you are now logged out')
})

export default router
