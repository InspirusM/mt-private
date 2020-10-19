const Command = require('../../base/Command');
const { MessageEmbed } = require('discord.js');

let track;

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

        if(player) track = player.queue.current.title;
        else track = args.join(" ");

        if(!track) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Provide a valid track title to search lyrics`
        }});

        let message = await msg.channel.send(`${this.client.emoji.search} | Searching...`);

        const result = await this.client.snek.get(`https://lyrics-api.powercord.dev/lyrics?input=${track}`);

        if(result.total === 0) message.edit({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | No results found!`
        }});

        const lyrics = this.client.utils.chunk(result.data.data[0].lyrics, 2040);

        if(!message.deleted && message.deletable) message.delete();
        
        const pages = [];

        for (let index = 0; index < lyrics.length; index++) {
            const str = lyrics;

            const embed = new MessageEmbed()
            .setColor(this.client.colors.primary)
            .setTitle(`${this.client.emoji.lyrics} | Lyrics`)
            .setDescription(`${str}`)
            .setFooter(`Page ${index + 1}/${pages.length}`);

            pages.push(embed);
        };
         
        this.client.utils.paginate(msg, pages, ['◀️', `${this.client.emoji.stop}`, '▶️'], 60000);
    }
};
