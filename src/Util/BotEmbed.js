const {MessageEmbed} = require("discord.js");

module.exports = class BotEmbed extends MessageEmbed {
    constructor(user, data = {}) {
        super(data)
        this.setColor("#000000")
        this.setFooter(`Requested by ${user.tag}`, user.displayAvatarURL({format:'png',dynamic:true,size:4096}))
    }
}