const client = new (require('./src/BotClient'))({
    disableMentions: "everyone",
	ws: {
		intents: ['GUILDS','GUILD_MEMBERS','GUILD_BANS','GUILD_EMOJIS','GUILD_INTEGRATIONS','GUILD_WEBHOOKS','GUILD_INVITES','GUILD_VOICE_STATES','GUILD_MESSAGES','GUILD_MESSAGE_REACTIONS','DIRECT_MESSAGES','DIRECT_MESSAGE_REACTIONS']
	}
});

if(client.shard) client.shardManager = new (require('./src/Util/ShardManager'))(client);

client.initClient({
	Commands: `${__dirname}/src/Commands`,
	Events: `${__dirname}/src/Events`,
	Locales: `${__dirname}/src/Lang`,
	Token: require('./config').token
});