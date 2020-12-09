
import test from 'ava'
import Messages from '../modules/messages.js'

test('NEW MESSAGE : ask question successfully', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		const result = await message.ask('test question', 1)
		test.is(result, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		message.close()
	}
})

test('NEW MESSAGE : missing question', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		await message.ask('', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test('NEW MESSAGE : missing item ID', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		await message.ask('test question', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test('NEW MESSAGE : item id not a number', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		await message.ask('test question', 'one')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'item ID must be a number')
	} finally {
		message.close()
	}
})

test('ANSWER QUESTION : answer successfully', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	await message.ask('test question', 1)
	try {
		const result = await message.answer('sample answer', 1)
		test.is(result, true)
	} catch(err) {
		test.fail(err.message)
	} finally {
		message.close()
	}
})
