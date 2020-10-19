const Command = require('../../base/Command');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['np'],
			description: 'Shows the information about current playing track',
            category: 'Music',
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
        }});

        const track = player.queue.current;

        const parsedCurrentDuration = this.client.utils.formatDuration(player.position);

        const parsedDuration = this.client.utils.formatDuration(track.duration);

        const part = Math.floor((player.position / track.duration) * 30);

        let status = player.playing ? this.client.emoji.play : this.client.emoji.pause;

        let progEmo = player.playing ? this.client.emoji.prog_blue : this.client.emoji.prog_red;

        let embedColor = player.playing ? this.client.colors.primary : this.client.colors.error;

        let requester = msg.guild.members.cache.get(track.requester) ? msg.guild.members.cache.get(track.requester).user.tag : "Unknown#0000";

        let progressBar = `${'─'.repeat(part) + progEmo + '─'.repeat(30 - part)}`;

        let embed = new MessageEmbed()
        .setColor(embedColor)
        .setThumbnail(track.thumbnail)
        .setTitle(`${this.client.emoji.tunes} | Now Playing`)
        .setDescription(`[${track.title}](${track.uri})\n
        \`\`\`${parsedCurrentDuration} ${status} ${progressBar} ${parsedDuration}\`\`\`
        `)
        .setFooter(`Requested by ${requester}`);

        return msg.channel.send(embed)
    }
};
