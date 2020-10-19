const { MessageEmbed, version: djsversion } = require('discord.js');
const { version } = require('../../package.json');
const Command = require('../../base/Command');
const { utc } = require('moment');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['info', 'bot'],
			description: 'Displays information about the bot.',
			category: 'General'
		});
	}

	run(message) { 
		const embed = new MessageEmbed()
			.setThumbnail(this.client.user.displayAvatarURL())
			.setColor(this.client.utils.hexColor)
      .setDescription(
`\`\`\`java
› Commands: ${this.client.commands.size}
› Servers: ${this.client.guilds.cache.size.toLocaleString()}
› Users: ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}
› Creation Date: ${utc(this.client.user.createdAt).format('LLL')} (${utc(this.client.user.createdAt, "YYYYMMDD").fromNow()})
› Node.js: ${process.version}
› Version: v${version}
› Uptime: ${this.client.utils.formatSeconds(process.uptime())}
› Memory Usage: ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)}/${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}\`\`\``)
.setTimestamp();

		message.channel.send(embed);
	}

};
