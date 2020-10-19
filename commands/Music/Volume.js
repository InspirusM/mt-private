const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['v'],
			description: 'Changes the volume for music player',
            category: 'Music',
            usage: ['<volume>', "reset"],
            examples: ["40", "reset"]
		});
	}

	async run(msg, args, data) {
        const player = this.client.player.players.get(msg.guild.id);

        if(!player || !msg.guild.me.voice.channel) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | No queue found for this server`
        }});

        if(!player.queue.current) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | There's no playback activity`
        }})

        if(msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel to use the command`
        }});

        let volume = parseInt(args[0]);

        if(isNaN(volume) || volume > 100 || volume < 0) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | The volume must be between 1 to 100`
        }});

        player.setVolume(volume);

        return msg.channel.send({embed: {
            color: this.client.colors.success,
            description: `${this.client.emoji.volume} | Volume set to ${volume}%`
        }});
    }
};
