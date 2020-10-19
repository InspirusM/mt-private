const Event = require('../../base/Event');
const Guild = require('../../models/Guild');
const data = {};


module.exports = class extends Event {

	async run(message) {
    
    if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;
    
    if (message.webhookID) return;
    
    if(message.guild && !message.member){
    await message.guild.members.fetch(message.author.id);
 }
    
    if(!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return;
    
    const mentionRegex = new RegExp(`^<@!?${this.client.user.id}>$`);
    const mentionRegexPrefix = new RegExp(`^<@!?${this.client.user.id}> `);
    
    const client = this.client;
    data.config = client.config;

    if(message.guild){
			// Gets guild data
		const guild = await client.findOrCreateGuild({ id: message.guild.id });
    message.guild.data = data.guild = guild;
  }
    client.prefix = data.guild.prefix;

    if (message.content.match(mentionRegex)) return message.channel.send(`My prefix for ${message.guild.name} is \`${data.guild.prefix}\`.`);

    const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : data.guild.prefix;
    
    if(!message.content.startsWith(prefix)) return;
        
    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
    
    const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		
    if (!command) return;
    
    const permission = command.checkPermissions(message);

    if(permission) {   
    
    try {
		  command.run(message, args, data);
      this.client.log('INFO',`[${message.guild.name}] ${message.author.tag} > ${command.name}`)
		} catch(e) {
      
      this.client.log('ERROR',e.stack)
      
      return message.channel.send({embed: {
        title: `An error occured on ${command.name}, the error has been reported!`,
        color:  this.client.utils.hexColor
      }});
    }
    }
	}

};
