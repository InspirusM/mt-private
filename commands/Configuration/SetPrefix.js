const Command = require('../../base/Command');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            aliases: ['prefix'],
            description: 'Changes the bot prefix for the server',
            category: 'Configuration',
            usage: ["setprefix <newprefix>",],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD'],
            examples: ["setprefix p!"]
		});
	}

	async run(msg, args, data) {
        let prefix = args[0];
        
        if(!args[0]) return this.argsMissing(msg);
    
        if(prefix.length > 5) return msg.channel.send({embed: { color: this.client.colors.error, description: `${this.client.emoji.cross} | The prefix is too long!`}}).then(m => m.delete({timeout: 15000}));
    
         data.guild.prefix = prefix;
         data.guild.save();
    
        return msg.channel.send({embed: { color: this.client.colors.success, description: `${this.client.emoji.checkmark} | Prefix has been updated to \`${prefix}\`` }})
    }
};
