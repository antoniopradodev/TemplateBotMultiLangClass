module.exports = class ErrorEvent {
	constructor(client) {
		this.client = client
	}

	run(err) {
		console.log(err.stack)
	}
}