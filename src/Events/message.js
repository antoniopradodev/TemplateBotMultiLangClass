const {BotEmbed} = require('../Util/');
const {utc, duration} = require("moment");
const {getFixedT} = require("i18next")
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

        let t = getFixedT((server && server.lang) || "pt-BR");

        if(message.content.replace(/!/g, "") === message.guild.me.toString().replace(/!/g, "")) {
            message.channel.send(`${t("events:mention", {user:message.author,prefix:server.prefix})}`)
        }

        if(!message.content.startsWith(server.prefix)) return;
        const args = message.content.slice(server.prefix.length).trim().split(/ +/g);
        const command = this.client.commands.get(args.shift().toLowerCase()) || this.client.commands.get(this.client.aliases.get(args.shift().toLowerCase()))
        if(!command) return;
        if(command.config.OnlyDevs) {
            if(!this.client.config.owners.includes(message.author.id)) return message.channel.send(t("permissions:ONLY_DEVS"));
        }

        const cooldown = new Map();
        if(cooldown.has(message.author.id)) {
            return message.channel.send(t("events:cooldown.message", {time:(cooldown.get(message.author.id) - Date.now() > 1000) ? utc(cooldown.get(message.author.id) - Date.now()).format(`ss [${t("events:cooldown.secounds")}]`) : duration(cooldown.get(message.author.id) - Date.now()).format(`[${t("events:cooldown.milliseconds")}]`)}))
        }

        if(!this.client.config.owners.includes(message.author.id)) {
            cooldown.set(message.author.id, Date.now() + command.cooldown);
            setTimeout(() => {cooldown.delete(message.author.id)}, command.cooldown)
        }

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
            command.run({message, args, server, user}, t)
        } catch (err) {
            message.channel.stopTyping(true);

            message.channel.send(
                new BotEmbed(message.author)
                .setDescription(`\`\`\`js\n${err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack}\`\`\``)

            )
            console.error(err.stack)
        }
    }
}