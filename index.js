const MusicalTuneClient = require('./structures/Client');
const { Manager } = require('erela.js')
const { MessageEmbed } = require('discord.js');
const { spotify: { clientID, clientSecret } } = require('./config');
const Spotify  = require("erela.js-spotify");

const client = new MusicalTuneClient();

client.on("raw", (d) => client.player.updateVoiceState(d));

client.player = new Manager({
	plugins: [ new Spotify({ clientID, clientSecret }) ],
	nodes: client.config.lavalink,
	autoPlay: true,
	send(id, payload) {
		const guild = client.guilds.cache.get(id);
		if(guild) guild.shard.send(payload);
		}
	})
	.on("nodeConnect", node => client.log('Lavalink', `${node.options.identifier} has been connected`))
	.on("nodeDisconnect", node => client.log('Lavalink', `${node.options.identifier} has been disconnected`))
	.on("nodeError", node => client.log('Lavalink', `${node.options.identifier} failed to connect`))
	.on("socketClosed", (player, payload) => {
		if(payload.byRemote === true) player.destroy();
	})
	.on("playerMove", (player, currentChannel, newChannel) => {
		if(!newChannel) player.destroy();
		else player.voiceChannel = newChannel;
	})
	.on("trackStart", (player, track) => {
		if(player.trackRepeat === false) {
			let embed = new MessageEmbed()
			.setColor(client.colors.primary)
			.setTitle(`${client.emoji.tunes} | Now Playing`)
			.setDescription(track.title)
			.setThumbnail(track.thumbnail);
			return client.channels.cache.get(player.textChannel).send(embed);
		}
	})
	.on("trackStuck", player => {
		let embed = new MessageEmbed()
		.setColor(client.colors.warning)
		.setTitle(`${client.emoji.warning} | Current playing track got stuck`)
		if(player.queue.size > 0) {
			player.stop();
			embed.setDescription(`${client.emoji.skip} | Skipping the track!`);
		}
		else player.destroy();
		return client.channels.cache.get(player.textChannel).send(embed);
	})
	.on("trackError", player => {
		let embed = new MessageEmbed()
		.setColor(client.colors.error)
		.setTitle(`${client.emoji.error} | An error occured while playing the current track`)
		if(player.queue.size > 0) {
			player.stop();
			embed.setDescription(`${client.emoji.skip} | Skipping the track!`);
		}
		else player.destroy();
		return client.channels.cache.get(player.textChannel).send(embed);
	})
	.on("trackEnd", player => {
		let voiceChannel = client.channels.cache.get(player.voiceChannel);
		setTimeout(() => {
			if(player.queue.size > 0) {
				if(voiceChannel.members.filter(m => !m.user.bot === 0)) return player.destroy();
				else {
					if(voiceChannel.member.filter(m => !m.user.bot === 0)) return player.destroy();
				}
			}
		}, 10000);
	})
	.on("queueEnd", player => {
		setTimeout(() => {
			if(player.queue.size > 0) return;
			else player.destroy();
		}, 10000);

		let embed = new MessageEmbed()
		.setColor(client.colors.primary)
		.setTitle('Queue Concluded')
		.setDescription('Queue more songs to keep the party going!');
		return client.channels.cache.get(player.textChannel).send(embed);
	});


client.start();

require('./server.js');

process.on("uncaughtException", err => {
  console.log(`Uncaught Exception:\n${err.stack}`);
  client.webhook.error(`Uncaught Exception:\n${err.message}`);
});

process.on('unhandledRejection', err => {
  console.log(`Unhandled Rejection:\n${err.stack}`);
  client.webhook.error(`Unhandled Rejection:\n${err.message}`);
});