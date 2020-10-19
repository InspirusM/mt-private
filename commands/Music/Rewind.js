const { prettyMs, parseNumber, parseTime } = require('../../structures/MusicUtils.js');
const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rwnd'],
			description: 'Rewinds a track to a certain position',
            category: 'Music',
            usage: "<position> minute/seconds",
            example: "1 minute"
		});
	}

	async run(msg, args, data) {
        const player = this.client.player.players.get(msg.guild.id);

        if(!player || !msg.guild.me.voice.channel) return msg.channel.send({embed: {
            color: this.client.config.colors.error,
            description: `${this.client.emoji.error} | No queue found for this server`
        }});

        if(!player.queue.current) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | There's no playback activity`
        }})

        if(msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send({embed: {
            color: this.client.config.error,
            description: `${this.client.config.emoji.error} | Connect to my voice channel to use the command`
        }});

        let ms = 0;
        const input = args.join(' ');
        
        if(!isNaN(input)) {
            ms = parseNumber(input) * 1000
        } else {
            const parsed = parseTime(input);
        if(parsed) {
            ms = parsed.relative;
        }};

        if(!ms || ms < 0) return msg.channel.send({embed: {
            color: this.client.colors.error,
            title: `${this.client.emoji.error} | You must define the position in seconds or minutes`
        }});
  
        if(ms < player.queue.current.duration) return msg.channel.send({embed: {
            color: this.client.colors.warning,
            title: `${this.client.emoji.error} | You cannot rewind beyond the track length`
        }});
  
        player.seek(player.position - ms);
  
        return msg.channel.send({embed: {
            color: msg.client.colors.success,
            title: `${msg.client.emoji.seek} | Seek`,
            description: `Song rewinds to ${prettyMs(ms)}`
        }});
    };
};
