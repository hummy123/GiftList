

import test from 'ava'
import Messages from '../modules/messages.js'
/* below imports are because of foreign keys, for the same reason
 * explained in test-items.js */
import Items from '../modules/items.js'
import Events from '../modules/events.js'
import Accounts from '../modules/accounts.js'
import fs from 'fs'


test.serial('NEW MESSAGE : ask question successfully', async test => {
	test.plan(1)
	// using real file for same reason explained in test-items.js
	const message = await new Messages('test-messages.db')
	try {
		const result = await message.ask('summary', 'test question', 1)
		test.is(result, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		message.close()
	}
})
/*
test.serial('NEW MESSAGE : missing summary', async test => {
	test.plan(1)
	const message = await new Messages('test-messages.db')
	try {
		await message.ask('', 'question', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test.serial('NEW MESSAGE : missing question', async test => {
	test.plan(1)
	const message = await new Messages('test-messages.db')
	try {
		await message.ask('summary', '', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test.serial('NEW MESSAGE : missing message ID', async test => {
	test.plan(1)
	const message = await new Messages('test-messages.db')
	try {
		await message.ask('summary', 'test question', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test.serial('NEW MESSAGE : item id not a number', async test => {
	test.plan(1)
	const message = await new Messages('test-messages.db')
	try {
		await message.ask('summary', 'test question', 'one')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'item ID must be a number')
	} finally {
		message.close()
	}
})

test.serial('ANSWER QUESTION : answer successfully', async test => {
	test.plan(1)
	const message = await new Messages('test-messages.db')
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

test.serial('ANSWER QUESTION : missing answer', async test => {
	test.plan(1)
	const message = await new Messages('test-messages.db')
	await message.answer('summary', 'test question', 1)
	try {
		await message.answer('', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		message.close()
	}
})

test.serial('ANSWER QUESTION : missing id', async test => {
	test.plan(1)
	const message = await new Messages('test-messages.db')
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
	const message = await new Messages('test-messages.db')
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
	const message = await new Messages('test-messages.db')
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
	const message = await new Messages('test-messages.db')
	try {
		await message.getMessage('one')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'messageID must be a number')
	} finally {
		message.close()
	}
})
*/
//create required foreign key tables before each test
test.serial.beforeEach(async t => {
	if (fs.existsSync('test-messages.db')) {
		fs.unlinkSync('test-messages.db') //delete db if it exists before test (fresh start)
	}
	const event = await new Events('test-messages.db')
	await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', 'image.jpg')
	event.close()
	const account = await new Accounts('test-messages.db')
	await account.register('doej', 'password', 'doej@gmail.com')
	account.close()
	const item = await new Items('test-messages.db')
	await item.newItem('umbrella', 12.5, 'image.jpg', 'https://tinyurl.com/yyyvpepn', 1)
	item.close()
	console.log(t)
})
