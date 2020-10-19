const Event = require('../base/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	run() {

		this.client.log("INFO", `${this.client.user.username} is ready now!`);

		this.client.player.init(this.client.user.id);

	//	const dbl = new DBL(client.config.dbl, client);

	//	setInterval(() => {
    //      dbl.postStats(client.guilds.cache.size, client.shard.id, client.shard.shardCount);
      //  }, 1800000);


		const activities = [
			`rich quality music`,
			`${this.client.config.prefix}help`,
			`music on ${this.client.player.players.size}`
		];

		let i = 0;
		setInterval(() => {
		 this.client.user.setPresence({activity: {
		 	name: `${activities[i++ % activities.length]}`,
		 	type: "STREAMING",
		 	url: "https://twitch.tv/hydrox127"
		 }})
		}, 15000);
	}

};
