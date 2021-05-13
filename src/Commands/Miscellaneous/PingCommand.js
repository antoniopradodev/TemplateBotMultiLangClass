const {Command, BotEmbed} = require('../../Util/');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			aliases: [],
			cooldown: 10,
			OnlyDevs: false
		})
	}
	run({ message, args, server, user }, t) {
		message.channel.send(`Pong!`)
	}
}
