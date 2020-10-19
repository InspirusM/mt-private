const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['c'],
			description: 'Removes all the tracks from the queue',
            category: 'Music',
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

        player.stop();
        player.setQueueRepeat(false);
        player.setTrackRepeat(false);
        if(player.queue.size > 0) player.queue.clear();
        else return;
        
        return msg.channel.send({embed: {
            color: this.client.colors.success,
            description: `${this.client.emoji.success} | Removed all the tracks from the queue`
        }});
    }
};
