module.exports = class ReadyEvent {
    constructor(client) {
        this.client = client
    }

    async run() {
        console.log(`[CLIENT] ${this.client.user.tag} logged!`);
    }
}