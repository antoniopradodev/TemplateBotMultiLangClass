module.exports = class ShardDisconnectEvent {
    constructor(client) {
        this.client = client
    }

    run(shard) {
        console.log(`[SHARDING MANAGER] Shard ${shard} has disconnected.`)
    }
}
