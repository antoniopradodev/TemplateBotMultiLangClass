const {BotEmbed} = require('../Util/');
const {utc, duration} = require("moment");
const i18next = require("i18next");
const {Collection} = require("discord.js");
require("moment-duration-format");

module.exports = class MessageEvent {
    constructor(client) {
        this.client = client
    }

    async run(message) {
        if(message.channel.type == "dm") return;
        if(message.author.bot) return;

        let server = await this.client.database.Guilds.findById(message.guild.id);
        let user = await this.client.database.Users.findById(message.author.id);
        if(!server) {this.client.database.Guilds({_id:message.guild.id}).save()}
        if(!user) {this.client.database.Users({_id:message.author.id}).save()}

        let t
		const setFixedT = function (translate) {
			t = translate
		}

		const language = (server && server.lang) || "pt-BR"
		setFixedT(i18next.getFixedT(language))

        if(message.content.replace(/!/g, "") === message.guild.me.toString().replace(/!/g, "")) {
            message.channel.send(`${t("events:message.mention_bot", {user:message.author,prefix:server.prefix})}`)
        }

        if(!message.content.startsWith(server.prefix)) return;
        const args = message.content.slice(server.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd))
        if(!command) return;
        if(command.config.OnlyDevs) {
            if(!this.client.config.owners.includes(message.author.id)) return message.channel.send(t("permissions:ONLY_DEVS"));
        }

        if(!this.client.cooldowns.has(command.config.name) && !this.client.config.owners.includes(message.author.id)) {
            this.client.cooldowns.set(command.config.name, new Collection());
        }

        const timestamps = this.client.cooldowns.get(command.config.name);
        const cooldownAmount = (command.config.cooldown) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (Date.now() < expirationTime) {
                return message.channel.send(`${t("events:message.cooldown.message", {time:(expirationTime - Date.now() > 1000) ? utc(expirationTime - Date.now()).format(`ss [${t("events:message.cooldown.secounds")}]`) : duration(expirationTime - Date.now()).format(`[${t("events:message.cooldown.milliseconds")}]`)})}`)
            }
        }

        timestamps.set(message.author.id, Date.now());
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        if(command.config.UserPermission !== null) {
            if(!message.member.hasPermission(command.config.UserPermission)) {
				return message.channel.send(`${t("permissions:USER_MISSING_PERMISSION", { perm: command.config.UserPermission.map(value => t(`permissions:${value}`)).join(", ") })}`)
			}
        }

        if(command.config.ClientPermission !== null) {
            if(!message.guild.me.hasPermission(command.config.ClientPermission) || !message.channel.permissionsFor(this.client.user.id).has(command.config.ClientPermission)) {
				return message.chinoReply("error", `${t("permissions:CLIENT_MISSING_PERMISSION", { perm: command.config.ClientPermission.map(value => t(`permissions:${value}`)).join(", ") })}`)
			}
        }
        
        try {
            command.setT(t);
            
            message.channel.startTyping(1)
            await command.run({message, args, server, user}, t);
            message.channel.stopTyping();
        } catch (err) {
            message.channel.stopTyping();

            message.channel.send(
                new BotEmbed(message.author)
                .setDescription(`\`\`\`js\n${err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack}\`\`\``)

            )
            console.error(err.stack)
        }
    }
}