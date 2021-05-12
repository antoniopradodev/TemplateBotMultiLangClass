const shards = new (require("discord.js")).ShardingManager("./index.js", {
	respawn: true,
	totalShards: require('./config').shards
});

shards.on("shardCreate", (shard) => {
	console.warn(`[SHARDING MANAGER] Launching shard ${shard.id}`)
});

shards.spawn().then(console.warn("[SHARDING MANAGER] Launching shards..."))