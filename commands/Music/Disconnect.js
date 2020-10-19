const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['leave', 'stop'],
			description: 'Disconnects the bot from voice channel and clears the queue',
            category: 'Music',
		});
	}

	async run(msg, args, data) {
        let player = this.client.player.players.get(msg.guild.id);

        if(!player) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | No queue found for this server`
        }})

        const memberVoice = msg.member.voice.channel;

        let botVoice = msg.guild.me.voice.channel;

        if(memberVoice.id !== botVoice.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel to use this command!`
        }});

        player.destroy();

        return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.success} | Removed all the tracks from queue and left the voice channel`
        }});
    }
};

