import test from 'ava'
import Events from '../modules/events.js'

test('NEW EVENT : create a valid event', async test => {
	test.plan(1)
	const event = await new Events() // no database specified so runs in-memory
	try {
		const created = await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', 'image.jpg', 1)
		test.is(created, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		event.close()
	}
})

test('NEW EVENT : error if blank title', async test => {
	test.plan(1)
	const event = await new Events()
	try {
		await event.newEvent('', 'event description', '2020-12-25 23:40:12:001', 'image.jpg', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('NEW EVENT : error if blank description', async test => {
	test.plan(1)
	const event = await new Events()
	try {
		await event.newEvent('my event', '', '2020-12-25 23:40:12:001', 'image.jpg', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('NEW EVENT : error if no date', async test => {
	test.plan(1)
	const event = await new Events()
	try {
		await event.newEvent('my event', 'event description', '', 'image.jpg', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('NEW EVENT : error if no image', async test => {
	test.plan(1)
	const event = await new Events()
	try {
		await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', '', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('NEW EVENT : error if no owner', async test => {
	test.plan(1)
	const event = await new Events()
	try {
		await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('GET EVENT : request valid event id', async test => {
	test.plan(1)
	const event = await new Events()
	await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', 'image.jpg', 1)
	try {
		const result = await event.getEvent(1)
		test.is(result.id, 1)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		event.close()
	}
})

test('GET EVENT : argument given is a string', async test => {
	test.plan(1)
	const event = await new Events()
	await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', 'image.jpg', 1)
	try {
		event.getEvent('one').catch(err => {
			test.is(err.message, 'id must be a number')
		})
	} finally {
		event.close()
	}
})

test('GET EVENT : integer id is out of range', async test => {
	test.plan(1)
	const event = await new Events()
	await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', 'image.jpg', 1)
	try {
		await event.getEvent(2)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no results')
	} finally {
		event.close()
	}
})
