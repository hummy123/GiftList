
/** @module Events */

import sqlite from 'sqlite-async'

/**
 * Events
 * ES6 module that handles creating and retrieving events events and logging in.
 */
class Events {
	/**
   * Create an event object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the events
			const sql = `CREATE TABLE IF NOT EXISTS events\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, date TEXT, image TEXT,
				creator_id INTEGER, FOREIGN KEY(creator_id) REFERENCES users(id));`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * creates a new event
	 * @param {String} title the name of the event
	 * @param {String} description the event description
	 * @param {String} date the date in ISO 6801 format ("YYYY-MM-DD HH:MM:SS.SSS")
	 * @param {String} image the name and extension of the event image
	 * @returns {Boolean} returns true if the new event has been created
	 */
	async newEvent(title, description, date, image) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		/* long line is necessary for query, but eslint throws a warning
		 * of a rule violation in that case, so split query string */
		let sql = 'INSERT INTO events(title, description, date, image)'
		sql += ` VALUES("${title}", "${description}", "${date}", "${image}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * gets a list of all events
	 * @returns {Object} returns array of all event objects
	 */
	async getEvents() {
		const sql = 'SELECT * FROM events'
		return await this.db.all(sql)
	}

	/**
	 * gets a single event
	 * @param {Number} primary key from db
	 * @returns {Object} returns javascript object of event if valid id
	 */
	async getEvent(id) {
		if(typeof id !== 'number') throw new Error('id must be a number')
		const sql = `SELECT * FROM events WHERE id=${id}`
		const result = await this.db.get(sql)
		if(result === undefined) throw new Error('no results')
		return result
	}

	async close() {
		await this.db.close()
	}
}

export default Events
