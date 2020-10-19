const Event = require('../../base/Event');
const Guild = require('../../models/Guild');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class extends Event {

	async run(oldVoice, newVoice) {

		if(!oldVoice.guild) return;

		let player = this.client.player.players.get(oldVoice.guild.id);

		if(!player) return;

		if(!newVoice.guild.members.cache.get(this.client.user.id).voice.channelID) player.destroy();

		if(oldVoice.id === this.client.user.id) return;

		if(!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelID) return;

		if(oldVoice.channelID === newVoice.channelID) return;

		if(oldVoice.guild.members.cache.get(this.client.user.id).voice.channelID === oldVoice.channelID) {
			if(oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.filter(m => !m.user.bot).size === 1) {
				const vcName = oldVoice.guild.voice.channel.name;

				const embed = new MessageEmbed()
				.setColor(this.client.colors.warning)
				.setDescription(`Leaving **${vcName}** in ${30000 / 1000} seconds`);

				const msg = await this.client.channels.cache.get(player.textChannel).send(embed);

				const delay = ms => new Promise(res => setTimeout(res, ms));

				await delay(30000);

				const vcMembers = oldVoice.guild.voice.channel.members.filter(m => !m.user.bot).size;

				if(!vcMembers || vcMembers === 1) {
					const newPlayer = this.client.player.players.get(newVoice.guild.id);

					if(newPlayer) player.destroy();
					else oldVoice.guild.voice.channel.leave();

					const newEmbed = new MessageEmbed()
					.setColor(this.client.colors.warning)
					.setDescription(`${this.client.emoji.eject} | Left **${vcName}**`);
					return msg.edit('', newEmbed);
				} else {
					if(!msg.deleted && msg.deletable) return msg.delete();
				}
			}
		} 
	}
};
