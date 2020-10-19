const { Client, Collection } = require('discord.js');
const Util = require('./Util.js');
const WebhookLogger = require('./WebhookLogger');
const SaavnProvider = require('./SaavnProvider');
const mongoose = require('mongoose');

module.exports = class MusicalTuneClient extends Client {

	constructor() {
		super({
			disableMentions: 'everyone',
      partials: [
       'MESSAGE',
       'USER',
       'GUILD_MEMBER',
       'REACTION',
       'CHANNEL'
     ],
		});
		this.filters = require('../assets/Filters');

		this.setFilter = require('../player/setFilter');

		this.config = require('../config.js');

		this.emoji = require('../assets/Emoji.js');

		this.colors = require('../assets/Color.js');

		this.commands = new Collection();

		this.aliases = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);

		this.webhook = new WebhookLogger(this);

		this.snek = require('axios');

		this.saavn = new SaavnProvider(this);

		//database
		this.guildsData = require('../models/Guild');
		this.databaseCache = {};
		this.databaseCache.guilds = new Collection();
	}
    //advanced logger
	log(logLevel, content, ...extras) {
        console.log(
          `[${this.utils.getTime}] [${logLevel}] ${content}${
            extras.length > 0 ? `\n\t${extras.join("\n\t").trim()}` : ""
          }`
        ); 
   }

   //guild database
   async findOrCreateGuild({ id: guildID }, isLean){
	if(this.databaseCache.guilds.get(guildID)){
		return isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID);
	} else {
		let guildData = (isLean ? await this.guildsData.findOne({ id: guildID }).populate("members").lean() : await this.guildsData.findOne({ id: guildID }).populate("members"));
		if(guildData){
			if(!isLean) this.databaseCache.guilds.set(guildID, guildData);
			return guildData;
		} else {
			guildData = new this.guildsData({ id: guildID });
			await guildData.save();
			this.databaseCache.guilds.set(guildID, guildData);
			return isLean ? guildData.toJSON() : guildData;
		}
	}
}

	start() {
		this.utils.loadCommands();
		this.utils.loadEvents();
    
    mongoose.connect(this.config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(this.log('MongoDB', 'Connection established'));
    
    return this.login(this.config.token)
  }

};
