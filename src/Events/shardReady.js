module.exports = class ShardReadyEvent {
    constructor(client) {
        this.client = client
    }

    run(shard) {
        console.log(`[SHARDING MANAGER] Shard ${shard} successfully launched and connected.`)
    }
}
