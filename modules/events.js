
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
			const sql = 'CREATE TABLE IF NOT EXISTS events\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, date TEXT, image TEXT);'
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
		const sql = 'INSERT INTO events(title, description, date, image)'
		sql += ` VALUES("${title}", "${description}", "${date}", "${image}")`
		await this.db.run(sql)
		return true
	}

	async getEvents() {
		const sql = 'SELECT * FROM events'
		return await this.db.all(sql)
	}

	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	/*
	async login(username, password) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT pass FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.pass)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return true
	}*/

	async close() {
		await this.db.close()
	}
}

export default Events
