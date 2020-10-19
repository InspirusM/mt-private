const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rplay'],
			description: 'Replays then current playing track',
            category: 'Music',
		});
	}

	async run(msg, args, data) {
        const player = this.client.player.players.get(msg.guild.id);

        if(!player || !msg.guild.me.voice.channel) return msg.channel.send({embed: {
            color: this.client.config.colors.error,
            description: `${this.client.emoji.error} | No queue found for this server`
        }});

        if(!player.queue.current) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | There's no playback activity`
        }})

        if(msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.config.emoji.error} | Connect to my voice channel to use the command`
        }});

        player.seek(0);

        return msg.channel.send({embed: {
            color: this.client.colors.success,
            description: `${this.client.emoji.rewind} | Replaying the current song...`
        }});
    };
};
