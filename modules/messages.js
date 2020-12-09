
/** @module Messages */

import sqlite from 'sqlite-async'

/**
 * Messages
 * ES6 module that handles sending and retrieving messages.
 */
class Messages {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the messages
			const sql = `CREATE TABLE IF NOT EXISTS messages\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, summary TEXT, question TEXT, answer TEXT,
				item_id INTEGER, FOREIGN KEY(item_id) REFERENCES item(id));`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * creates a new question
	 * @param {String} summary like the subject line in an email
	 * @param {String} question what the user asks
	 * @param {Number} itemID the item linked to the question
	 * @returns {Boolean} returns true if message created successfully
	 */
	async ask(summary, question, itemID) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		if (typeof itemID !== 'number') throw new Error('item ID must be a number')
		const sql = `INSERT INTO messages(summary, question, item_id) 
					VALUES("${summary}", "${question}", "${itemID}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * answers an existing question
	 * @param {String} answer the response given by list owner
	 * @param {Number} messageID the id of the message to update
	 * @returns {Boolean} returns true if record correctly updated
	 */
	async answer(answer, messageID) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		if (typeof messageID !== 'number') throw new Error('messageID must be a number')
		const sql = `UPDATE messages SET answer="${answer}" WHERE id=${messageID}`
		await this.db.run(sql)
		return true
	}
	
	/**
	 * gets all messages related to a specific item
	 * @param {Number} itemID the item to retrieve questions about
	 * @returns {Object} returns list of messages
	 */
	async getMessages(itemID) {
		if(typeof itemID !== 'number') throw new Error('itemID must be a number')
		const sql = `SELECT * FROM messages WHERE item_id=${itemID}`
		const result = await this.db.get(sql)
		if(result === undefined) throw new Error('no messages')
		return result
	}
	
	/**
	 * gets a specific message
	 * @param {Number} messageID identifies which message object to retrieve
	 * @returns {Object} returns a single message object
	 */
	async getMessage(messageID) {
		if(typeof messageID !== 'number') throw new Error('messageID must be a number')
		const sql = `SELECT * FROM messages WHERE id=${messageID}`
		const result = await this.db.get(sql)
		if(result === undefined) throw new Error('no messages')
		return result
	}

	async close() {
		await this.db.close()
	}
}

export default Messages
