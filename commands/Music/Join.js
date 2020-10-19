const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['connect', 'summon'],
			description: 'Connects the bot to your voice channel',
            category: 'Music',
		});
	}

	async run(msg, args, data) {
        const memberVoice = msg.member.voice.channel;

        if(!meee) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to a voice channel!`
        }});

        if(!memberVoice.joinable || !memberVoice.speakable) return msg.channel.send({embed: {
            color: this.client.colors.error,
            title: `${this.client.emoji.error} | Unable to connect`,
            description: `I don't have permission to connect or speak in that channel`
        }});

        let player = this.client.player.players.get(msg.guild.id);

        let botVoice = msg.guild.me.voice.channel;

        if(!player || botVoice) {
            player = this.client.player.create({
                selfDeafen: true,
                guild: msg.guild.id,
                voiceChannel: memberVoice.id,
                textChannel: message.channel.id,
                volume: 100
            });
            player.connect();
            return msg.channel.send({embed: {
                color: this.client.colors.error,
                description: `${this.client.emoji.success} | Connected to **${memberVoice.name}**`
            }});
        } else if (memberVoice.id !== botVoice.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel!`
        }});

        setTimeout(() => {
            if(player.queue.current) return;
            else player.destroy();
            return msg.channel.send({embed: {
                color: this.client.colors.warning,
                description: `${this.client.emoji.warning} | No tracks in the queue. Leaving the voice channel!`
            }});
        }, 30000)
    }
};
