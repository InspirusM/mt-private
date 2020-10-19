const Event = require('../../base/Event');

module.exports = class extends Event {

	async run(guild) {

        if(!guild) return;

        await this.client.guildsData.findOneAndDelete({ id: guild.id });

        this.client.webhook.guild({
            color: this.client.colors.error,
            title: 'Guild Left',
            description: `Name: ${guild.name}\nGuild ID: ${guild.id}\nMember Count: ${guild.memberCount}\nTotal Guilds: ${this.client.guilds.cache.size}`
        });
	}
};
