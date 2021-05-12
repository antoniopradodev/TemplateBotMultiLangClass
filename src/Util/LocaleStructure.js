const {readdirSync} = require("fs");
const {use} = require("i18next");
const translationBackend = require("i18next-node-fs-backend");

module.exports = class LocaleStructure {
    constructor(client) {
        this.client = client
        this.languages = ["pt-BR", "en-US"]
        this.ns = ["commands", "events", "permissions"]
    }

    async initLocales(dir) {
        try {
            use(translationBackend).init({
                ns:this.ns,
                preload: await readdirSync(dir),
                fallbackLng: "pt-BR",
                backend: {
                    loadPath: `${dir}/{{lng}}/{{ns}}.json`
                },
                interpolation: {
                    escapeValue: false
                },
                returnEmpyString: false
            });
        } catch(err) {
        }
    }

    load(dir) {
        try {
            this.initLocales(dir);
            console.log("[LOCALES] Locales loaded!");
            return true;
        } catch (e) {
            console.err(err);
        }
    }
}