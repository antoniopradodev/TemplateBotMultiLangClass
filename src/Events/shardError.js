module.exports = class ShardErrorEvent {
    constructor(client) {
        this.client = client
    }

    run(err, shard) {
        console.log(`[SHARDING MANAGER] ERR! Shard ${shard} error: ${err}`)
    }
}
