module.exports = class ShardReconnectEvent {
    constructor(client) {
        this.client = client
    }

    run(shard) {
        console.log(`[SHARDING MANAGER] Relaunching shard ${shard}...`)
    }
}
