const { MessageEmbed } = require('discord.js');
const Command = require('../../base/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['invite'],
			description: 'Gives the invite link of the bot',
			category: 'General',
		});
	}
 async run(msg) {
   let embed = new MessageEmbed()
  .setColor('#ff00ff')
  .setAuthor('Invite',  this.client.user.displayAvatarURL())
	.setDescription(`
Invite Link: [Click here](https://discord.com/oauth2/authorize?scope=bot&permissions=8&client_id=${this.client.user.id})
Support Server: [Click here](https://discord.gg/wYRmy2S)
Instagram: [Click Here](https://www.instagram.com/tunemusical/)
`);
return msg.channel.send(embed)
 }
}