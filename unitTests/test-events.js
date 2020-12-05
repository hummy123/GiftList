import test from 'ava'
import Events from '../modules/events.js'

test('NEW EVENT : create a valid event', async test => {
	test.plan(1)
	const event = await new Events() // no database specified so runs in-memory
	try {
		const eventCreated = await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', 'image.jpg')
		test.is(eventCreated, true)
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
		await event.newEvent('', 'event description', '2020-12-25 23:40:12:001', 'image.jpg')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('REGISTER : error if blank description', async test => {
	test.plan(1)
	const event = await new Events()
	try {
		await event.newEvent('my event', '', '2020-12-25 23:40:12:001', 'image.jpg')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('REGISTER : error if no time', async test => {
	test.plan(1)
	const event = await new Events()
	try {
		await event.newEvent('my event', 'event description', '', 'image.jpg')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		event.close()
	}
})

test('REGISTER : error if no image', async test => {
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