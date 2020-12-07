import test from 'ava'
import Items from '../modules/items.js'
import Events from '../modules/events.js'
import fs from 'fs'


test.serial('NEW ITEM : create a valid item', async test => {
	test.plan(1)
	/* specify temporary test.db because item table uses foreign keys,
	 * and easier to test on real file in that case*/
	const item = await new Items('test.db')
	try {
		//name, price, details, link, eventID
		const result = await item.newItem('umbrella', 12.5, 'large golf brollie', 'https://tinyurl.com/yyyvpepn', 1)
		test.is(result, true)
	} catch(err) {
		test.fail(err.message)
	} finally {
		item.close()
	}
})

test.serial('NEW ITEM : error if blank name', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.newItem('', 12.5, 'large golf brollie', 'https://tinyurl.com/yyyvpepn', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		item.close()
	}
})

test.serial('NEW ITEM : error if blank price', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.newItem('umbrella', '', 'large golf brollie', 'https://tinyurl.com/yyyvpepn', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		item.close()
	}
})

test.serial('NEW ITEM : error if blank details', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.newItem('umbrella', 12.5, '', 'https://tinyurl.com/yyyvpepn', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		item.close()
	}
})

test.serial('NEW ITEM : error if blank link', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.newItem('umbrella', 12.5, 'large golf brollie', '', 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		item.close()
	}
})

test.serial('NEW ITEM : error if blank eventID', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.newItem('umbrella', '', 'large golf brollie', 'https://tinyurl.com/yyyvpepn', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		item.close()
	}
})

test.serial('GET ITEM : get existing item', async test => {
	test.plan(1)
	//first create item to get
	const item = await new Items('test.db')
	await item.newItem('umbrella', 12.5, 'large golf brollie', 'https://tinyurl.com/yyyvpepn', 1)
	try {
		const result = await item.getItem(1)
		test.is(result.id, 1)
	} catch(err) {
		test.fail(err.message)
	} finally {
		item.close()
	}
})

test.serial('GET ITEM : error if item does not exist', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.getItem(1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no items')
	} finally {
		item.close()
	}
})

test.serial('GET ITEM : error if id not number', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.getItem('one')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'id must be a number')
	} finally {
		item.close()
	}
})

test.serial('SET PLEDGE : pledge a valid item', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	await item.newItem('umbrella', 12.5, 'large golf brollie', 'https://tinyurl.com/yyyvpepn', 1)
	try {
		const result = await item.pledgeItem(1, 1)
		test.is(result, true)
	} catch(err) {
		test.fail(err.message)
	} finally {
		item.close()
	}
})

test.serial('SET PLEDGE : pledge invalid item', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.pledgeItem(1, 1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no items')
	} finally {
		item.close()
	}
})

test.serial('UNPLEDGE : remove pledge for valid item', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	await item.newItem('umbrella', 12.5, 'large golf brollie', 'https://tinyurl.com/yyyvpepn', 1)
	try {
		const result = await item.unPledgeItem(1)
		test.is(result, true)
	} catch(err) {
		test.fail(err.message)
	} finally {
		item.close()
	}
})

test.serial('UNPLEDGE : specify invalid item', async test => {
	test.plan(1)
	const item = await new Items('test.db')
	try {
		await item.unPledgeItem(1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no items')
	} finally {
		item.close()
	}
})


//always put data in required (foreign key) events table before each test
test.serial.beforeEach(async t => {
	if (fs.existsSync('test.db')) {
		fs.unlinkSync('test.db') //delete db if it exists before test (fresh start)
	}
	console.log(t)
	const event = await new Events('test.db')
	await event.newEvent('my event', 'event description', '2020-12-25 23:40:12:001', 'image.jpg')
	event.close()
})
