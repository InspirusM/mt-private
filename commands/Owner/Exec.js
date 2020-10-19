const Command = require('../../base/Command');
const  { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
const choice = ['🚫'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['$', 'bash'],
			description: 'Executes bash commands',
			category: 'Developers',
      ownerOnly: true
		});
	}

	async run(msg, args) {
    
      let value = args.join(' ');
      if(!value) msg.channel.createMessage('No arguments passed!')
      const m = await msg.channel.send(`❯_ ${  args.join(' ')}`);
      exec(`${args.join(' ')}`, async (e, stdout, stderr) => {
      if(e) return m.edit({embed: {
        color: msg.client.config.colors.error,
        description: msg.client.util.codeBlock(e.message, "bash")
      }});

      if (!stdout && !stderr) {
            return msg.channel.send({embed: {
                      color: msg.client.config.colors.warning,
                      description: "Completed without result"
          }});
     };
     const embed = new MessageEmbed()
        .setColor("#81FF00")
        let output;
        if(stdout) {
          if(stdout.length > 1024) output = await msg.client.util.haste(stdout);
          else output = msg.client.utils.codeBlock(stdout, "bash");
          embed.setDescription(output);
        }
        if(stderr) {
          if(stderr.length > 1024) output = await msg.client.util.haste(stderr);
          else output = msg.client.utils.codeBlock(stderr, "bash");
          embed.setColor("#FF0000");
          embed.setDescription(output);
        }
        let m = await msg.channel.send(embed)

    for (const chot of choice) {
      await m.react(chot);
    }
    const filter = (rect, usr) => choice.includes(rect.emoji.name) && usr.id === msg.author.id;
    m.createReactionCollector(filter, { time: 600000, max: 1 }).on("collect", async col => {
      if (col.emoji.name === "🚫") return m.delete();
    });
  });
	}

};


