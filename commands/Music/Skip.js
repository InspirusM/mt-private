const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['s', 'next'],
			description: 'Skips to the next track',
            category: 'Music',
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
            description: `${this.client.emoji.error} | There's no playback activity`
        }})

        const memberVoice = msg.member.voice.channel;

        let botVoice = msg.guild.me.voice.channel;

        if(memberVoice.id !== botVoice.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel to use this command!`
        }});

        const current = player.queue.current.title;

        const voiceChannel = msg.guild.voice.channel.members.filter(m => !m.user.bot);
    
        const memberCount = voiceChannel.size;

        if(memberCount > 2) {
        const votesNeeded = memberCount % 2 === 0 ? memberCount / 2 + 1 : Math.ceil(memberCount / 2);

        const voteMsg = await msg.channel.send({embed: {
            color: this.client.colors.success,
            description: `${this.client.emoji.vote} | Vote to skip (10s)\n
            \`${player.queue.current.title}\`
            Required Votes: ${votesNeeded}/${memberCount}
            `
        }});

        await voteMsg.react(this.client.emoji.vote);

        const filter = (reaction, user) => reaction.emoji.name === this.client.emoji.vote && voiceChannel.has(user.id);

        const reactions = await voteMsg.awaitReactions(filter, {time: 10000});

        const votes = reactions.has(this.client.emoji.vote) ? reactions.get(this.client.emoji.vote).count - 1 : 0;

        if(votes >= votesNeeded && player.queue[0] && current === player.queue.current.title) {

            if(!voteMsg.deleted && voteMsg.deletable) await voteMsg.delete();

            if(player.trackRepeat) player.setTrackRepeat(false);

            if(player.queueRepeat) player.setQueueRepeat(false);

            player.stop();

            return msg.channel.send({embed: {
                color: this.client.colors.success,
                description: `${this.client.emoji.skip} | Skipping the current playing track`
            }});
        } else {
            voteMsg.edit({embed: {
                color: this.client.colors.error,
                description: `${this.client.emoji.error} | Skip canceled. Not enough votes`
            }});
        } 
    } else {
        player.stop();

        return msg.channel.send({embed: {
            color: this.client.colors.success,
            description: `${this.client.emoji.skip} | Skipping the current playing track`
        }});
    }

    }
};

