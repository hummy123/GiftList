/** @module Mail */

import nodemailer from 'nodemailer'

/**
 * Mail
 * ES6 module that sends emails to users.
 * NOTE: Cannot unit test this module because
 * emails are not isolated within the system.
 * Only able to check for internal syntax/logic errors,
 * but unit testing email violates FIRST principles.
 */

/**
 * Sends an email
 * @param {String} recipient the address to send to
 * @param {String} mailSubject what email is about
 * @param {String} message the text to send
 * @returns {Boolean} returns true if mail sent
 */
export default function sendMail(recipient, mailSubject, message) {
	const mailTemplate = {
		from: 'shahidh7@uni.coventry.ac.uk',
		to: recipient, subject: mailSubject, text: message
	}
	const giftmailer = nodemailer.createTransport({
		service: 'Outlook365',
		auth: {
			user: 'shahidh7@uni.coventry.ac.uk',
			pass: '1qaz!QAZ'
		}
	})
	giftmailer.sendMail(mailTemplate, (err) => {
		if (err) {
			console.log(err)
		} else {
			return true
		}
	})
}
