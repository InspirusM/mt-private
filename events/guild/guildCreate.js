const Event = require('../../base/Event');

module.exports = class extends Event {

	async run(guild) {

        if(!guild) return;

        let defaultChannel = "";

        msg.guild.channels.cache.forEach((channel) => {

            if(channel.type === "text" && ["general-chat", "general", "public-chat"].includes(channel.name) && defaultChannel ===  "") { 

                if(channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) {

                    defaultChannel = channel;
                }
            }

            if(channel.type == "text" && defaultChannel == "") {

                if(channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) {

                    defaultChannel = channel;
                }
            }
        });

        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(this.client.user.avatarURL())
        .setDescription(`Thanks for inviting me!
        The default prefix is ${this.client.config.prefix} and it is customizable
        and the help command is ${this.client.config.prefix}help
        If you need any help related bot join our support server.
        `)
        .setFooter("RED Bots")
        defaultChannel.send("https://discord.gg/pVjMsBX", embed);

        this.client.webhook.guild({
            color: this.client.colors.success,
            title: 'Guild Joined',
            description: `Name: ${guild.name}\nGuild ID: ${guild.id}\nMember Count: ${guild.memberCount}\nTotal Guilds: ${this.client.guilds.cache.size}`
        });
	}
};
