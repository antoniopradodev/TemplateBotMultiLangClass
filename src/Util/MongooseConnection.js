const {mongourl, prefix} = require('../../config');
const {connect, Schema, model} = require("mongoose");

connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	if(err) return console.log(`[MONGOOSE] Error to connecting to database! \n[MONGOOSE] ${err}`)
	console.log("[MONGOOSE] Successfully connected to database!")
})

module.exports.Guilds = model(
    "Guilds", 
    new Schema({
        _id: { type: String },
        prefix: { type: String, default: prefix },
        lang: { type: String, default: "pt-BR" }
    })
)

module.exports.Users = model(
    "Users", 
    new Schema({
        _id: { type: String }
    })
)