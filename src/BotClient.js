const {Client, Collection} = require("discord.js");
const {readdir} = require("fs");
const {EventManager, MongooseConnection} = require('./Util/')

module.exports = class BotClient extends Client {
    constructor(options = {}) {
        super(options)

        this.commands = new Collection()
		this.aliases = new Collection()
		this.events = new EventManager(this)
        this.database = MongooseConnection
        this.config = require(`../config`)
    }

    initClient({Commands, Events, Locales, Token} = {}) {
        this.loadCommands(Commands);
        this.loadEvents(Events);
        this.loadLocales(Locales);
        this.login(Token);
    }

    async login(token) {
        return super.login(token)
    }

    loadLocales(dir) {
        let {LocaleStructure} = require('./Util/')
        new  LocaleStructure(this).load(dir);
    }

    loadCommands(path) {
        readdir(path, (err, archives) => {
            if(err) console.err(err);
            archives.forEach(category => {
                readdir(`${path}/${category}`, (err, cmd) => {
                    cmd.forEach(async (cmd) => {
                        const command = new (require(`${path}/${category}/${cmd}`))(this);
                        command.dir = `${path}/${category}/${cmd}`;
                        this.commands.set(command.config.name, command);
                        command.config.aliases.forEach(alia => this.aliases.set(alia, command.config.name));
                    })
                })
            })
        });
        return this;
    }

    reloadCommand(commandName) {
        const command = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName));
        if(!command) return false;
        this.commands.delete(command.name);
        delete require.cache[require.resolve(command.dir)];
        try {
            const cmd = new (require(command.dir))(this);
            this.commands.set(cmd.name, cmd)
            return true;
        } catch (e) {
            return e;
        }
    }

    loadEvents(dir) {
        readdir(dir, (err, archives) => {
            if(err) console.err(err);
            archives.forEach(ev => {
                const event = new (require(`./Events/${ev}`))(this);
                this.events.add(ev.split(".")[0], event)
            });
        });
        return this;
    }

    reloadEvent(eventName) {
        const event = this.events.events.includes(eventName);
        if(!event) return false;
        if(!this.events.remove(eventName)) return this.events.remove(eventName);
        delete require.cache[require.resolve(`${path}/${eventName}.js`)];
        try {
            const event = new (require(`${path}/${eventName}.js`))(this);
            this.events.add(eventName, event);
            return true;
        } catch (e) {
            return e;
        }
    }
}