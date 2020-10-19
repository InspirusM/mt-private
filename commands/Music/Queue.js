const { MessageEmbed } = require('discord.js');
const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['q'],
			description: 'Shows the queue for a server',
            category: 'Music',
            usage: ["[index]"],
            example: ["4"]
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

        const parsedQueueDuration = this.client.utils.formatDuration(this.client.utils.queueDuration(player));

        let pagesNum = Math.ceil(player.queue.size / 10);

        if(pagesNum === 0) pagesNum = 1;

        const tracksData = [];

        player.queue.forEach((track, i) => tracksData.push(`**${i + 1}**. [${track.title}](${track.url}) \`${this.client.utils.formatDuration(track.duration)}\` by ${msg.guild.members.cache.get(track.requester).user.tag}`));
    
        const pages = [];

        for (let index = 0; index < pagesNum; index++) {
            const str = tracksData.slice(index * 10, index * 10 + 10).join('\n');

            const embed = new MessageEmbed()
            .setAuthor(`Queue | ${msg.guild.name}`, msg.guild.iconURL())
            .setColor(this.client.colors.primary)
            .setDescription(`Total Duration: ${parsedQueueDuration} • ${player.queue.size - 1} Track(s)\n\n${str}`)
            .setFooter(`Page ${index + 1}/${pages.length}`);

            pages.push(embed);
        };

        if(!args[0]) {
            if(pages.length === pagesNum && player.queue.length > 10) this.client.utils.paginate(msg, pages, ['◀️', `${this.client.emoji.stop}`, '▶️'], 60000);
            else return msg.channel.send(pages[0])
        } else {
            if(isNaN(parseInt(args[0]))) return msg.channel.send({embed: {
                color: this.client.colors.error,
                description: `${this.client.emoji.error} | Page index must be a valid number`
            }});

            if(parseInt(args[0]) > pagesNum) return msg.channel.send({embed: {
                color: this.client.colors.error,
                description: `${this.client.emoji.error} | Total pages available: ${pagesNum}`,
            }});

            const pageNum = parseInt(args[0]) === 0 ? 1 : parseInt(args[0]) - 1;

            return msg.channel.send(pages[pageNum]);
        }


    }
};
