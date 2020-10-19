const Command = require('../../base/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['p'],
			description: 'Plays a song with a provided query or url',
            category: 'Music',
            usage: ['<track title | track url | playlist url>'],
            examples: ['ncs songs']
		});
	}

	async run(msg, args, data) {
        const memberVoice = msg.member.voice.channel;
        if(!memberVoice) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Please connect to a voice channel to queue tracks!`
        }});

        if(!memberVoice.joinable || !memberVoice.speakable) return msg.channel.send({embed: {
            color: this.client.colors.error,
            title: `${this.client.emoji.error} | Unable to connect`,
            description: `I don't have permission to connect or speak in that channel`
        }});

        let player = this.client.player.players.get(msg.guild.id);

        const botVoice = msg.guild.me.voice.channel;

        if(!botVoice || !player) {
            player = this.client.player.create({
                selfDeafen: true,
                guild: msg.guild.id,
                voiceChannel: memberVoice.id,
                textChannel: msg.channel.id
            });
            player.connect();
        } else if(memberVoice.id !== botVoice.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel to queue tracks!`
        }});

        const res = await this.client.player.search(args.join(" "), msg.author.id);

        if(res.loadType === "LOAD_FAILED") return msg.channel.send({embed: {
            color: this.client.colors.error,
            title: `${this.client.emoji.error} | Unable to queue the track`,
            description: `${res.exception.message}`
        }});

        if(res.loadType === "NO_MATCHES") return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | No results found!`,
        }});

        if(res.loadType === "TRACK_LOADED") {
            player.queue.add(res.tracks[0]);

            if(!player.playing) player.play();

            return msg.channel.send({embed: {
                color: this.client.colors.primary,
                description: `${this.client.emoji.success} | Enqueued ${res.tracks[0].title}`
            }});
        };

        if(res.loadType === "SEARCH_RESULT") {
        	player.queue.add(res.tracks[0]);

        	if(!player.playing) player.play();

        	return msg.channel.send({embed: {
        		color: this.client.colors.primary,
        		description: `${this.client.emoji.success} | Enqueued ${res.tracks[0].title}`
        	}});
        };

        if(res.loadType === "PLAYLIST_LOADED") {
        	res.tracks.forEach(track => player.queue.add(track));

        	if(!player.playing) player.play();

        	return msg.channel.send({embed: {
        		color: this.client.colors.primary,
        		title: `${this.client.emoji.success} | Enqueued ${res.playlist.name}`,
        	    description: `Total ${res.tracks.length} tracks`
        	}})
        };
        
	}
};
