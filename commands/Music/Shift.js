const Command = require('../../base/Command');
const { parseNumber } = require('../../structures/MusicUtils');

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

        if(!player.queue.size < 3) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | There must be atleast 3 tracks in queue`
        }});

        let from = parseNumber(args[0]) - 1;
        let to = parseNumber(args[1]) - 1;
        
        if(isNaN(from)) return msg.channel.send({embed: {
            color: msg.client.colors.warning,
            title: `${this.client.emoji.error} | Please provide a valid from index!`
        }});
      
        if(isNaN(to)) return msg.channel.send({embed: {
            color: msg.client.colors.warning,
            title: `${this.client.emoji.error} | Please provide a valid new index!`
        }});

        if(to > player.queue.size) return msg.channel.send({embed: {
            color: msg.client.colors.warning,
            title: `${this.client.emoji.error} | The shift to index must be equal to or less than \`${player.queue.size + 1}\``
        }});

        player.queue.splice(from, to);
      
        return msg.channel.send({embed: {
              color: msg.client.colors.success,
              title: `Shifted \`${player.queue[to].title}\` from \`${from}\` to \`${to}\``
        }});
  



    }
};
