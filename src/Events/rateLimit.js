module.exports = class RateLimitClient {
	constructor(client) {
		this.client = client
	}

	run(info) {
		console.log(info)
	}
}
