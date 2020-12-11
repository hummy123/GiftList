
/** @module Messages */

import sqlite from 'sqlite-async'
import sendMail from './mail.js'

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
				item_id INTEGER, asker_id INTEGER ,
				FOREIGN KEY(item_id) REFERENCES items(id)
				FOREIGN KEY(asker_id) REFERENCES users(id));`
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
		await this.askEmail(summary, question, itemID)
		return true
	}

	/**
	 * sends an email about the question being asked
	 * @param {String} summary a brief description of the question
	 * @param {String} question the text of the question in full
	 * @param {Number} itemID the item being asked about
	 * @returns {Boolean} returns true if question successfully asked
	 */
	async askEmail(summary, question, itemID) {
		const sql = `SELECT * from items, users WHERE items.id=${itemID}`
		const results = await this.db.get(sql)
		const recipient = results.email
		const subject = `You have received an item wishlist question. Answer now!`
		const message = `\nHi there\n
						You have just received a question about an item on your wishlist.
						 \nQuestion: ${question} Product details: ${results.link}\n
						Visit https://shahidh7-sem1.herokuapp.com/ to answer!`
		sendMail(recipient, subject, message)
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
		const sql = `UPDATE messages 
					SET answer="${answer}"
					WHERE id=${messageID}`
		await this.db.run(sql)
		await this.answerEmail(messageID)
		return true
	}

	/**
	 * sends an email to person who asked question
	 * @param {String} summary a brief description of the question
	 * @param {String} question the text of the question in full
	 * @param {Number} itemID the item being asked about
	 * @returns {Boolean} returns true if question successfully asked
	 */
	async answerEmail(messageID) {
		//get user who asked question (so we can get their email)
		let sql = `SELECT * from users, messages WHERE messages.id=${messageID}`
		let results = await this.db.get(sql)
		const recipient = results.email
		const question = results.question
		const answer = results.answer
		//get link for the item the question is about
		sql = `SELECT * FROM items, messages WHERE messages.id=${messageID}`
		results = await this.db.get(sql)
		const subject = 'You have received an answer to your question!'
		const message = `\nHi there\n
						You have just received an answer in response to a question you asked.
						\nYour question: ${question}
						 \nAnswer: ${answer}\nProduct link: ${results.link}
						\nVisit https://shahidh7-sem1.herokuapp.com/ to act!`
		sendMail(recipient, subject, message)
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
		const result = await this.db.all(sql)
		if(result === undefined) return null
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
