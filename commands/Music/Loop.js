const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['repeat'],
			description: 'Repeats the whole queue or a single track',
            category: 'Music',
            usage: ["<queue | current | none>"],
            example: ["current"]
		});
	}

	async run(msg, args, data) {
        let player = this.client.player.players.get(msg.guild.id);

        if(!player) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | No queue found for this server`
        }});

        if(!player.queue.current) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.colors.error} | There's no playback activity`
        }});

        const memberVoice = msg.member.voice.channel;

        const botVoice = msg.guild.me.voice.channel;

        if(memberVoice.id !== botVoice.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel to use this command!`
        }});

        let type = args[0].toLowerCase();

        switch(type) {
            case "current" || "track":

                if(player.trackRepeat) player.setTrackRepeat(false);
                player.setTrackRepeat(true);

                return msg.channel.send({embed: {
                    color: this.client.colors.success,
                    title: `${this.client.emoji.loop} | Repeat Toggled`,
                    description: `Repeat mode: ${player.trackRepeat ? "Current": "None"}`
                }});
            break;
            case "queue" || "all": 
                
                if(player.queueRepeat) player.setQueueRepeat(false);    

                player.setQueueRepeat(true);

                return msg.channel.send({embed: {
                    color: this.client.colors.success,
                    title: `${this.client.emoji.loop} | Repeat Toggled`,
                    description: `Repeat mode: ${player.queueRepeat ? "Queue" : "None"}`
                }});
            break;
            case "none" || "disable":
                if(player.queueRepeat) player.setQueueRepeat(false);
                if(player.trackRepeat) player.setTrackRepeat(false);
                else return;

                return msg.channel.send({embed: {
                    color: this.client.colors.success,
                    title: `${this.client.emoji.loop} | Repeat Toggled`,
                    description: `Repeat mode: None`
                }});
            default:
                return msg.channel.send({embed: {
                    color: this.client.colors.error,
                    description: `All valid repeat options are: ${data.guild.prefix}${this.name}<track | queue | none>`
                }})
        }
    }
};