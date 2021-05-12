const {Command, BotEmbed} = require('../../Util/');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			aliases: []
		})
	}
	run({ message, args, server, user }, t) {
		message.channel.send(`Pong!`)
	}
}
