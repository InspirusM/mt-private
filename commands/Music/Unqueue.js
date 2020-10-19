const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['uq', 'remove', 'r'],
			description: 'Removes a track from the queue',
            category: 'Music',
            usage: ['remove <track position>'],
            examples: ['remove 5']
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
            description: `${this.client.emoji.error} | Connect to my voice channel to use the command`
        }});

        let position = parseInt(args[0]) - 1;

        if(!position) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Provide a track position to remove the track from the queue`
        }});

        if(isNaN(position)) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Track position must be a number`
        }});

        if(amount < 0 || amount > player.queue.size) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Track position must be higher than 0 and less than ${player.queue.size + 1}`
        }});

        const { title } = player.queue[position];

        player.queue.remove(position);

        return msg.channel.send({embed: {
            color: this.client.colors.success,
            description: `${this.client.emoji.eject} | Unqueued ${title}`
        }});
    }
};
