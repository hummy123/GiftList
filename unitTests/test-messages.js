
import test from 'ava'
import Messages from '../modules/messages.js'

test('NEW MESSAGE : ask question successfully', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		const result = await message.ask('summary', 'test question', 1)
		test.is(result, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		message.close()
	}
})

test('NEW MESSAGE : missing summary', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		await message.ask('', 'question', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test('NEW MESSAGE : missing question', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		await message.ask('summary', '', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test('NEW MESSAGE : missing message ID', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	try {
		await message.ask('summary', 'test question', '')
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
		await message.ask('summary', 'test question', 'one')
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
	await message.ask('summary', 'test question', 1)
	try {
		const result = await message.answer('sample answer', 1)
		test.is(result, true)
	} catch(err) {
		test.fail(err.message)
	} finally {
		message.close()
	}
})

test('ANSWER QUESTION : missing answer', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	await message.ask('summary', 'test question', 1)
	try {
		await message.answer('', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test('ANSWER QUESTION : missing id', async test => {
	test.plan(1)
	const message = await new Messages() // no database specified so runs in-memory
	await message.ask('summary', 'test question', 1)
	try {
		await message.answer('test answer', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test.serial('GET MESSAGE : get existing message successfully', async test => {
	test.plan(1)
	//first create message to get
	const message = await new Messages() // no database specified so runs in-memory
	await message.ask('summary', 'test question', 1)
	try {
		const result = await message.getMessage(1)
		test.is(result.id, 1)
	} catch(err) {
		test.fail(err.message)
	} finally {
		message.close()
	}
})

test.serial('GET MESSAGE : error if message does not exist', async test => {
	test.plan(1)
	const message = await new Messages()
	try {
		await message.getMessage(1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no messages')
	} finally {
		message.close()
	}
})

test.serial('GET MESSAGE : error if id not number', async test => {
	test.plan(1)
	const message = await new Messages()
	try {
		await message.getMessage('one')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'messageID must be a number')
	} finally {
		message.close()
	}
})
