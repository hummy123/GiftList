
/** @module Items */

import sqlite from 'sqlite-async'
import sendMail from './mail.js'

/**
 * Events
 * ES6 module that handles creating, modifying and retrieving items.
 */
class Items {
	/**
   * Create an item object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the items
			const sql = `CREATE TABLE IF NOT EXISTS items\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, 
				name TEXT, price REAL, image TEXT, link TEXT, pledged INTEGER DEFAULT 0,
				event_id INTEGER, donor_id INTEGER, thanks INTEGER DEFAULT 0,
				FOREIGN KEY(event_id) REFERENCES event(id),
				FOREIGN KEY(donor_id) REFERENCES users(id));`
			/* all values required, except for donor id if item not pledged.
			 * Pledged defaults to 0 because no one has pledged an item
			 * at the exact same time it is created.*/
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * creates a new item
	 * @param {String} name the name of the item
	 * @param {String} price how much the item costs in £ gbp
	 * @param {String} image server URL pointing to uploaded image
	 * @param {String} link a link to buy the item from
	 * @param {String} eventID to connect the item to an event
	 * @returns {Boolean} returns true if the new event has been created
	 */
	async newItem(name, price, image, link, eventID) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		/* long line is necessary for query, but eslint throws a warning
		 * of a rule violation in that case, so split query string */
		let sql = 'INSERT INTO items(name, price, image, link, event_id)'
		sql += ` VALUES("${name}", "${price}", "${image}", "${link}", "${eventID}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * retrieves items for a specific event
	 * @param {Number} eventID the id to
	 * @returns {Object} returns array of item objects for event
	 */
	async getEventItems(eventID) {
		if(typeof eventID !== 'number') throw new Error('eventID must be a number')
		const sql = `SELECT * FROM items
					WHERE event_id=${eventID}`
		const result = await this.db.all(sql)
		if(result === undefined) throw new Error('no items')
		return result
	}

	/**
	 * retrieves a single item
	 * @param {Number} id the item's primary key
	 * @returns {Object} returns a single item object if successful
	 */
	async getItem(id) {
		if(typeof id !== 'number') throw new Error('id must be a number')
		const sql = `SELECT * FROM items, users WHERE items.id=${id}`
		const result = await this.db.get(sql)
		if(result === undefined) throw new Error('no items')
		return result
	}

	/**
	 * pledges item and registers donor
	 * @param {Number} itemID the item's primary key
	 * @param {Number} donorID the user who pledged the item
	 * @returns {Boolean} returns true if pledge successful
	 */
	async pledgeItem(itemID, donorID) {
		await this.getItem(itemID) //throw error if no match
		const sql = `UPDATE items 
					SET pledged = 1, donor_id=${donorID}
					WHERE id=${itemID}`
		await this.db.run(sql)
		await this.notifyPledge(itemID, donorID)
		return true
	}

	/**
	 * retrieves various db info and constructs/sends message to notify of pledge
	 * @param {Number} itemID the item's primary key
	 * @param {Number} donorID identifies donor who made pledge
	 * @returns {Boolean} returns true if removal successful
	 */
	async notifyPledge(itemID, donorID) {
		const sql = `SELECT * from items, users WHERE items.id=${itemID} AND users.id=${donorID}`
		const results = await this.db.get(sql)
		const recipient = results.email
		const subject = `An item has been pledged to you by ${results.user}!`
		const message = `\nHi there\n
						You have just received a pledge for an item on your wishlist by ${results.user}, 
						${results.name} costing £${results.price}!
						 \nProduct details: ${results.link}\n
						Visit https://shahidh7-sem1.herokuapp.com/ to thank them!`
		sendMail(recipient, subject, message)
		return true
	}

	/**
	 * stores on system that creator has received pledge and thanks donor
	 * @param {Number} itemID the item the list owner is thanking for
	 * @param {Number} creatorID identifies the list owner
	 * @returns {Boolean} returns true if successfully record on
	 */
	async thankDonor(itemID, donorID) {
		const sql = `UPDATE items SET thanks = 1 WHERE id=${itemID}`
		await this.db.run(sql)
		await this.thanksMessage(itemID, donorID)
		return true
	}

	/**
	 * retrieves various db info and constructs/sends a message to thank donor of pledge
	 * @param {Number} itemID the item's primary key
	 * @param {Number} donorID identifies donor who made pledge
	 * @returns {Boolean} returns true if removal successful
	 */
	async thanksMessage(itemID, donorID) {
		const sql = `SELECT * from items, users WHERE items.id=${itemID} AND users.id=${donorID}`
		const results = await this.db.run(sql)
		const recipient = results.email
		const subject = `You have been thanked by ${results.user} for your pledge!`
		const message = `Hi there\n\n
						We just wanted to let you know that ${results.user} has seen
						the pledge you kindly placed for ${results.name} and 
						wanted to express gratitude for it. Thank you!
						 \n\nProduct details: ${results.link}\n\n
						Events accessible from https://shahidh7-sem1.herokuapp.com/!`
		sendMail(recipient, subject, message)
		return true
	}

	/**
	 * removes item pledge and removes donor name
	 * @param {Number} id the item's primary key
	 * @returns {Boolean} returns true if removal successful
	 */
	async unPledgeItem(itemID) {
		await this.getItem(itemID) //error if no match
		const sql = `UPDATE items SET pledged = 0, donor_id = null WHERE id=${itemID}`
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export default Items
