const Command = require('../../base/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['jiosaavn'],
			description: 'Plays a song from saavan with a provided query or url',
            category: 'Music',
            usage: ['<track title | track url>'],
            examples: ["Meri Aashiqui", "Don't let me down"]
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
                textChannel: msg.channel.id,
                volume: 100
            });
            player.connect();
        } else if(memberVoice.id !== botVoice.id) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Connect to my voice channel to queue tracks!`
        }});

        let query = args.join(" ");

        if(!query) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Please provide a search query!`
        }});
        
        if(this.client.utils.validateSaavn(query)) return msg.channel.send({embed: {
            color: this.client.colors.error,
            description: `${this.client.emoji.error} | Links are currently not supported`
        }});
        
        const search = await this.client.saavn.search(query);

        let tracks = search.slice(0, 5);

        if(search.length < tracks.length) tracks = search;

        let embed = await msg.channel.send({embed: {
            color: this.client.colors.warning,
            title: `${this.client.emoji.search} | Select a track`,
            description: `${tracks.map((data, i) => `**${++i}**. ${data.title}`).join("\n")}`,
            footer: { text: `Select a track from 1 - ${tracks.length} | \`c\` to cancel`}
        }});

        let collector = msg.channel.createMessageCollector(m => {
            return m.author.id === msg.author.id && new RegExp(`^([1-5]|cancel|c)$`, "i").test(m.content)},
            {time:30e3, max: 1});

        collector.on('collect', async m => {
            if(/cancel|c/i.test(m.content)) return collector.stop('cancel');

            let track = tracks[Number(m.content) - 1];

            const fSearch = await this.client.saavn.songInfo(track.id);

            const res = await this.client.player.search(fSearch.media_url, msg.author.id);

            let queueData = {
               track: res.tracks[0].track,
               title: fSearch.song,
               identifier: res.tracks[0].identifier,
               author: res.tracks[0].music,
               duration: res.tracks[0].duration,
               isSeekable: res.tracks[0].isSeekable,
               isStream: res.tracks[0].isStream,
               uri: fSearch.perma_url,
               thumbnail: fSearch.image,
               displayThumbnail: '',
               requester: res.tracks[0].requester
            };

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
                player.queue.add(queueData);

                if(!player.playing) player.play();

                return msg.channel.send({embed: {
                    color: this.client.colors.primary,
                    description: `${this.client.emoji.success} | Enqueued ${queueData.title}`
                }});
            };

        });

        collector.on('end', (_, reason) => {
            if(["time", "cancel"].includes(reason)) {
                        
             if(!player.queue.current) player.destroy();
              
              return msg.channel.send({embed: {
                color: this.client.colors.error,
                description: `${this.client.emoji.error} | Track selection canceled!`
            }});
              
          }
          
           if(!embed.deleted && embed.deletable) embed.delete();
           if(!msg.deleted && msg.deletable) msg.delete();
            
        });
	}
};
