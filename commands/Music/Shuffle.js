const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [''],
			description: 'Randomizes the tracks in the queue',
            category: 'Music',
		});
	}

	async run(msg, args, data) {
        const player = this.client.player.players.get(msg.guild.id);

        if(!player || !msg.guild.me.voice.channel) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | No queue found for this server`
        }});

        if(!player.queue.size > 3) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | There's must be more than 3 songs in the queue to shuffle the queue`
        }})

        if(msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel to use the command`
        }});

        player.queue.shuffle();

        return msg.channel.send({embed: {
            color: this.client.colors.success,
            description: `${this.client.emoji.shuffle} | Queue Shuffled`
        }});
    }
};
