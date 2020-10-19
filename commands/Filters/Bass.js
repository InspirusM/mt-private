const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['b'],
			description: 'Adds bassboost effect to a track',
            category: 'Audio Filters',
            usage: 'reset'
		});
	}

	async run(msg, args, data) {
        const player = this.client.player.players.get(msg.guild.id);

        if(!player || !msg.guild.me.voice.channel) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | No queue found for this server`
        }});

        if(msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.config.emoji.error} | Connect to my voice channel to use the command`
        }});

        if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) msg.client.setFilter(msg, player, 'bass', false);
        else msg.client.setFilter(msg, player, 'bass', true);    
    }
};
